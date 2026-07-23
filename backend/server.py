from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import asyncio
import time as _time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta
from urllib.parse import quote_plus
from email.utils import parsedate_to_datetime

import seed_data
from seed_data import (
    TEAMS, PLAYERS, COACHES, UPDATES, SEED_VERSION, TIER1_SOURCES, MOCK_VIDEOS, CURATED_NEWS,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ---------------- Helpers ----------------
def clean(doc):
    if doc:
        doc.pop("_id", None)
    return doc


async def team_by_name(name):
    return clean(await db.teams.find_one({"name": name}))


# ---------------- Teams / Players / Coaches ----------------
@api_router.get("/teams")
async def get_teams():
    return [clean(t) for t in await db.teams.find().sort("name", 1).to_list(100)]


@api_router.get("/players")
async def get_players(q: Optional[str] = None, team: Optional[str] = None,
                      role: Optional[str] = None, tier: Optional[str] = None):
    query = {}
    if team:
        query["team"] = team
    if role:
        query["position"] = role
    if tier:
        query["value_tier"] = tier
    if q:
        query["name"] = {"$regex": re.escape(q), "$options": "i"}
    rows = await db.players.find(query).sort("name", 1).to_list(600)
    return [clean(r) for r in rows]


@api_router.get("/coaches")
async def get_coaches():
    return [clean(c) for c in await db.coaches.find().sort("name", 1).to_list(100)]


@api_router.get("/profile/{pid}")
async def get_profile(pid: str):
    player = clean(await db.players.find_one({"id": pid}))
    if player:
        player["kind"] = "player"
        player["team_info"] = await team_by_name(player["team"])
        ups = await db.updates.find({"player_id": pid}).to_list(50)
        player["timeline"] = sorted([clean(u) for u in ups], key=lambda x: x.get("date", ""))
        return player
    coach = clean(await db.coaches.find_one({"id": pid}))
    if coach:
        coach["kind"] = "coach"
        coach["team_info"] = await team_by_name(coach["team"])
        coach["timeline"] = []
        return coach
    raise HTTPException(status_code=404, detail="Not found")


# ---------------- Matchmaker ----------------
class MatchReq(BaseModel):
    player_query: str
    team_query: str


FEAS = {
    "Budget Alto": {"Top": "Media", "Media": "Alta", "Accessibile": "Alta"},
    "Bilanciato": {"Top": "Bassa", "Media": "Media", "Accessibile": "Alta"},
    "Autofinanziamento": {"Top": "Bassa", "Media": "Bassa", "Accessibile": "Media"},
}
FEAS_COLOR = {"Alta": "#22C55E", "Media": "#EAB308", "Bassa": "#EF4444"}


@api_router.post("/matchmaker")
async def matchmaker(req: MatchReq):
    pq = seed_data._slug(req.player_query.strip())
    tq = seed_data._slug(req.team_query.strip())
    all_players = [clean(p) for p in await db.players.find().to_list(600)]
    all_teams = [clean(t) for t in await db.teams.find().to_list(100)]
    player = next((p for p in all_players if pq and pq in seed_data._slug(p["name"])), None)
    team = next((t for t in all_teams if tq and tq in seed_data._slug(t["name"])), None)
    if not player or not team:
        return {"found": False, "message": "Giocatore o squadra non trovati nel database Serie A."}
    feas = FEAS.get(team["wealth_tier"], {}).get(player["value_tier"], "Media")
    ups = await db.updates.find({"player_id": player["id"]}).to_list(50)
    sources = {u["source"] for u in ups}
    verified = sum(1 for u in ups if u.get("verified"))
    if not ups:
        db_status = "Nessuna notizia rilevata in database."
    else:
        db_status = f"Trattativa attiva: {len(sources)} fonti collegate" + (f" (di cui {verified} verificata/e)." if verified else ".")
    return {
        "found": True,
        "player": player,
        "team": team,
        "feasibility": feas,
        "color": FEAS_COLOR[feas],
        "db_status": db_status,
        "news_count": len(ups),
        "verified_count": verified,
    }


# ---------------- Live News (curated + Google News RSS) + Video (mock) ----------------
_news_cache = {}
STAGE_COLOR = {"ufficiale": "#22C55E", "trattativa": "#EAB308", "rumor": "#94A3B8"}


def _status_from_title(title):
    t = title.lower()
    if any(k in t for k in ["ufficiale", "here we go", "firma", "firmato", "è fatta"]):
        return "ufficiale", "#22C55E"
    if any(k in t for k in ["accordo", "trattativa", "vicino", "contatti", "offerta", "sì", "affare"]):
        return "trattativa", "#EAB308"
    return "rumor", "#94A3B8"


def _curated_feed(query):
    now = datetime.now(timezone.utc)
    ql = (query or "").strip().lower()
    generic = ql in ("", "serie a", "calciomercato", "serie a calciomercato")
    out = []
    for n in CURATED_NEWS:
        hay = f"{n['title']} {n['source']} {n.get('handle','')} {n.get('player','')} {n.get('team','')}".lower()
        if not generic and ql not in hay:
            continue
        row = dict(n)
        row["published"] = (now - timedelta(hours=row.pop("hours_ago", 0))).isoformat()
        row["color"] = STAGE_COLOR.get(row.get("stage"), "#94A3B8")
        row["type"] = "post"
        row["link"] = f"https://news.google.com/search?q={quote_plus(n.get('player') or query or 'Serie A')}%20calciomercato&hl=it"
        row["curated"] = True
        out.append(row)
    return out


def _fetch_google_news(query, limit):
    q = quote_plus(f"{query} calciomercato")
    url = f"https://news.google.com/rss/search?q={q}%20when:14d&hl=it&gl=IT&ceid=IT:it"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=12).read()
    root = ET.fromstring(data)
    items = []
    for it in root.iter("item"):
        title = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        pub = it.findtext("pubDate")
        src_el = it.find("source")
        source = (src_el.text.strip() if src_el is not None and src_el.text else "")
        clean_title = title
        if source and title.endswith(f" - {source}"):
            clean_title = title[: -(len(source) + 3)].strip()
        elif " - " in title:
            parts = title.rsplit(" - ", 1)
            clean_title, source = parts[0].strip(), (source or parts[1].strip())
        try:
            iso = parsedate_to_datetime(pub).astimezone(timezone.utc).isoformat()
        except Exception:
            iso = datetime.now(timezone.utc).isoformat()
        verified = any(source.strip().lower() == s.lower() or s.lower() in source.strip().lower() for s in TIER1_SOURCES)
        stage, color = _status_from_title(clean_title)
        items.append({
            "id": str(abs(hash(link)) % (10 ** 12)),
            "title": clean_title, "source": source or "Google News", "link": link,
            "published": iso, "verified": verified, "stage": stage, "color": color, "type": "post",
        })
        if len(items) >= limit:
            break
    return items


@api_router.get("/news/live")
async def news_live(q: str = "Serie A", limit: int = 30):
    key = f"{q}:{limit}"
    now = _time.time()
    cached = _news_cache.get(key)
    if cached and now - cached[0] < 45:
        return cached[1]
    curated = _curated_feed(q)
    live = []
    try:
        loop = asyncio.get_event_loop()
        live = await loop.run_in_executor(None, _fetch_google_news, q, limit)
    except Exception as e:
        logger.error(f"news_live error: {e}")
    # Merge: curated first (rich, always present) + live Google News, dedupe by title
    seen = set()
    merged = []
    for it in curated + live:
        t = it.get("title", "").strip().lower()[:60]
        if t in seen:
            continue
        seen.add(t)
        merged.append(it)
    merged.sort(key=lambda x: x.get("published", ""), reverse=True)
    merged = merged[:limit]
    _news_cache[key] = (now, merged)
    return merged


@api_router.get("/news/official")
async def news_official(limit: int = 8):
    items = [n for n in _curated_feed("") if n.get("stage") == "ufficiale"]
    items.sort(key=lambda x: x.get("published", ""), reverse=True)
    return items[:limit]


@api_router.get("/news/videos")
async def news_videos(q: Optional[str] = None):
    now = datetime.now(timezone.utc)
    out = []
    for v in MOCK_VIDEOS:
        if q and q.lower() not in (v["title"] + v["player"] + v["team"]).lower():
            continue
        row = dict(v)
        row["published"] = (now - timedelta(days=row.pop("days_ago", 0))).isoformat()
        row["stage"], row["color"] = _status_from_title(v["title"])
        row["type"] = "video"
        row["link"] = f"https://www.youtube.com/results?search_query={quote_plus(v['title'])}"
        out.append(row)
    return out


@api_router.get("/")
async def root():
    return {"message": "TransferHub API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware, allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"], allow_headers=["*"],
)


@app.on_event("startup")
async def seed_db():
    meta = await db.meta.find_one({"_id": "seed"})
    if not meta or meta.get("version") != SEED_VERSION:
        logger.info(f"Seeding TransferHub DB to v{SEED_VERSION}")
        for c in ["teams", "players", "coaches", "updates"]:
            await db[c].delete_many({})
        await db.teams.insert_many([dict(t) for t in TEAMS])
        await db.players.insert_many([dict(p) for p in PLAYERS])
        await db.coaches.insert_many([dict(c) for c in COACHES])
        now = datetime.now(timezone.utc)
        ups = []
        for u in UPDATES:
            row = dict(u)
            d = now - timedelta(days=row.pop("days_ago", 0))
            row["date"] = d.isoformat()
            ups.append(row)
        if ups:
            await db.updates.insert_many(ups)
        await db.meta.update_one({"_id": "seed"}, {"$set": {"version": SEED_VERSION}}, upsert=True)
        logger.info("Seed complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
