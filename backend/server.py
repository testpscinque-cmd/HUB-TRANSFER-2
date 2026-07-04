from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import random
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

from emergentintegrations.llm.chat import LlmChat, UserMessage

import seed_data
from seed_data import (
    PROFILES, SOURCES, RUMORS, SEED_VERSION,
    GLOBAL_ALERTS, PIPELINE, VERIFICATION_TASKS, PIPELINE_STAGES,
    STREAK_USERS, DAILY_CHALLENGES, VERIFIED_PROFILE_IDS,
)
from urllib.parse import quote_plus

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

STAGES = ["Interesse Iniziale", "Contatti", "Trattativa Avanzata", "Fumata Bianca/Ufficiale", "Saltata"]


# ---------- Models ----------
class CareerEntry(BaseModel):
    club: str
    from_: Optional[int] = Field(default=None, alias="from")
    to: Optional[int] = None

    class Config:
        populate_by_name = True


class Profile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    role: str = "Player"
    position: Optional[str] = ""
    league: Optional[str] = ""
    current_club: Optional[str] = ""
    contract_expiry: Optional[str] = ""
    estimated_salary: Optional[str] = ""
    representation_agency: Optional[str] = ""
    nationality: Optional[str] = ""
    age: Optional[int] = None
    market_value: Optional[str] = ""
    verified_status: Optional[bool] = False
    internal_notes: Optional[str] = ""
    image: Optional[str] = ""
    career_history: List[dict] = []


class ProfileCreate(BaseModel):
    full_name: str
    role: str = "Player"
    position: Optional[str] = ""
    league: Optional[str] = ""
    current_club: Optional[str] = ""
    contract_expiry: Optional[str] = ""
    estimated_salary: Optional[str] = ""
    representation_agency: Optional[str] = ""
    nationality: Optional[str] = ""
    age: Optional[int] = None
    market_value: Optional[str] = ""
    internal_notes: Optional[str] = ""
    image: Optional[str] = ""
    career_history: List[dict] = []


class Rumor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    profile_id: str
    date_logged: str
    stage: str
    source_name: str
    deal_formula: Optional[str] = ""
    evolution_description: str
    logged_at: Optional[str] = ""
    external_link_url: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class RumorCreate(BaseModel):
    profile_id: str
    date_logged: str
    stage: str
    source_name: str
    deal_formula: Optional[str] = ""
    evolution_description: str


class Source(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_name: str
    reliability_score: int = 50
    notes: Optional[str] = ""


class ConsistencyRequest(BaseModel):
    profile_id: str
    stage: str
    source_name: str
    deal_formula: Optional[str] = ""
    evolution_description: str


class PipelineUpdate(BaseModel):
    stage: Optional[str] = None
    priority_tier: Optional[str] = None
    exclusive_angle_notes: Optional[str] = None


class TaskUpdate(BaseModel):
    is_done: Optional[bool] = None


class TaskCreate(BaseModel):
    pipeline_id: Optional[str] = ""
    player_name: str
    action_required: str
    deadline: Optional[str] = ""


# ---------- Profiles ----------
@api_router.get("/profiles", response_model=List[Profile])
async def get_profiles(q: Optional[str] = None, role: Optional[str] = None, club: Optional[str] = None):
    query = {}
    if q:
        query["full_name"] = {"$regex": re.escape(q), "$options": "i"}
    if role and role.lower() != "all":
        query["role"] = role
    if club and club.lower() != "all":
        query["current_club"] = club
    docs = await db.profiles.find(query, {"_id": 0}).to_list(500)
    docs.sort(key=lambda p: p.get("full_name", ""))
    return docs


@api_router.get("/clubs")
async def get_clubs():
    clubs = await db.profiles.distinct("current_club")
    return sorted([c for c in clubs if c])


@api_router.get("/profiles/{profile_id}", response_model=Profile)
async def get_profile(profile_id: str):
    doc = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Profile not found")
    return doc


@api_router.post("/profiles", response_model=Profile)
async def create_profile(payload: ProfileCreate):
    obj = Profile(**payload.model_dump())
    await db.profiles.insert_one(obj.model_dump())
    return obj


# ---------- Rumors ----------
@api_router.get("/profiles/{profile_id}/rumors", response_model=List[Rumor])
async def get_profile_rumors(profile_id: str):
    docs = await db.rumors.find({"profile_id": profile_id}, {"_id": 0}).to_list(500)
    docs.sort(key=lambda r: r.get("date_logged", ""))
    return docs


@api_router.get("/rumors/recent")
async def get_recent_rumors(limit: int = 25):
    docs = await db.rumors.find({}, {"_id": 0}).to_list(1000)
    docs.sort(key=lambda r: (r.get("logged_at", "") or r.get("date_logged", ""), r.get("created_at", "")), reverse=True)
    docs = docs[:limit]
    profiles = {p["id"]: p for p in await db.profiles.find({}, {"_id": 0}).to_list(500)}
    out = []
    for r in docs:
        p = profiles.get(r["profile_id"], {})
        out.append({
            **r,
            "full_name": p.get("full_name", "Unknown"),
            "role": p.get("role", ""),
            "current_club": p.get("current_club", ""),
            "position": p.get("position", ""),
            "league": p.get("league", ""),
            "contract_expiry": p.get("contract_expiry", ""),
            "verified_status": p.get("verified_status", False),
            "image": p.get("image", ""),
        })
    return out


@api_router.post("/rumors", response_model=Rumor)
async def create_rumor(payload: RumorCreate):
    data = payload.model_dump()
    now = datetime.now(timezone.utc)
    data["logged_at"] = f"{data['date_logged']}T{now.strftime('%H:%M:%S')}"
    obj = Rumor(**data)
    await db.rumors.insert_one(obj.model_dump())
    return obj


# ---------- Sources ----------
@api_router.get("/sources", response_model=List[Source])
async def get_sources():
    docs = await db.sources.find({}, {"_id": 0}).to_list(500)
    docs.sort(key=lambda s: s.get("reliability_score", 0), reverse=True)
    return docs


# ---------- AI Consistency Checker ----------
def _extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    return json.loads(match.group(0) if match else text)


async def _llm(system_message: str, prompt: str, session: str) -> str:
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY, session_id=session, system_message=system_message,
    ).with_model("anthropic", "claude-sonnet-4-6")
    return await chat.send_message(UserMessage(text=prompt))


@api_router.post("/consistency-check")
async def consistency_check(payload: ConsistencyRequest):
    profile = await db.profiles.find_one({"id": payload.profile_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    source = await db.sources.find_one({"source_name": payload.source_name}, {"_id": 0})
    reliability = source.get("reliability_score") if source else None

    system_message = (
        "You are the Consistency Auditor for a professional football transfer-market intelligence desk. "
        "You cross-check an incoming transfer rumor against the verified profile database and flag logical "
        "contradictions before publication (e.g. 'free transfer' claim while contract runs for years, wrong "
        "current club, deal formula conflicting with reality, or a low-reliability source making a strong "
        "official claim). Today is 2025-07-05. Respond with STRICT JSON only. Schema: "
        '{"has_contradiction": boolean, "severity": "none"|"low"|"medium"|"high", "message_en": string, '
        '"message_it": string, "advice_en": string, "advice_it": string}. Each message under 240 chars. '
        "message_it must be natural Italian."
    )
    prompt = (
        f"VERIFIED PROFILE:\n- Name: {profile.get('full_name')}\n- Role: {profile.get('role')}\n"
        f"- Current club: {profile.get('current_club')}\n- Contract expiry: {profile.get('contract_expiry')}\n"
        f"- Salary: {profile.get('estimated_salary')}\n- Agency: {profile.get('representation_agency')}\n"
        f"- Notes: {profile.get('internal_notes')}\n\nINCOMING RUMOR:\n- Stage: {payload.stage}\n"
        f"- Source: {payload.source_name} (reliability {reliability if reliability is not None else '?'}/100)\n"
        f"- Deal formula: {payload.deal_formula}\n- Description: {payload.evolution_description}\n\n"
        f"Audit and return the JSON verdict."
    )
    try:
        result = _extract_json(await _llm(system_message, prompt, f"consistency-{payload.profile_id}"))
    except Exception as e:
        logger.error(f"Consistency check failed: {e}")
        return {"has_contradiction": False, "severity": "none",
                "message_en": "AI audit unavailable right now. Please verify manually.",
                "message_it": "Controllo AI non disponibile ora. Verifica manualmente.",
                "advice_en": "", "advice_it": "", "error": True}
    for k in ["has_contradiction", "severity", "message_en", "message_it", "advice_en", "advice_it"]:
        result.setdefault(k, False if k == "has_contradiction" else ("none" if k == "severity" else ""))
    return result


# ---------- AI Article Draft (Saga -> Article) ----------
@api_router.post("/profiles/{profile_id}/article-draft")
async def article_draft(profile_id: str, lang: str = "en"):
    profile = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    rumors = await db.rumors.find({"profile_id": profile_id}, {"_id": 0}).to_list(500)
    rumors.sort(key=lambda r: r.get("date_logged", ""))
    if not rumors:
        raise HTTPException(status_code=400, detail="No rumors to summarize")
    language = "Italian" if lang == "it" else "English"
    timeline = "\n".join(
        f"- {r['date_logged']} [{r['stage']}] via {r['source_name']} ({r.get('deal_formula','')}): {r['evolution_description']}"
        for r in rumors
    )
    system_message = (
        f"You are a professional football transfer journalist writing for a modern sports newsroom. Write a concise, "
        f"publication-ready DRAFT article in {language} summarizing the transfer saga of a player/coach based ONLY on the "
        f"logged timeline and profile facts provided. Be factual, cite sources inline, note the current stage, and end with "
        f"an outlook. Do NOT invent confirmed outcomes not present in the timeline. Respond with STRICT JSON only: "
        f'{{"title": string, "body": string}}. "body" is 3-5 short paragraphs separated by \\n\\n, ~180-260 words.'
    )
    prompt = (
        f"PROFILE:\n- Name: {profile['full_name']} ({profile['role']}, {profile.get('position','')})\n"
        f"- Current club: {profile.get('current_club')}\n- Contract until: {profile.get('contract_expiry')}\n"
        f"- Agent: {profile.get('representation_agency')}\n- Market value: {profile.get('market_value')}\n\n"
        f"RUMOR TIMELINE (chronological):\n{timeline}\n\nWrite the draft."
    )
    try:
        result = _extract_json(await _llm(system_message, prompt, f"article-{profile_id}"))
        title = result.get("title") or f"{profile['full_name']}: transfer saga"
        body = result.get("body") or ""
        if not body:
            raise ValueError("empty body")
    except Exception as e:
        logger.error(f"Article draft failed: {e}")
        title = f"{profile['full_name']}: latest on the {profile.get('current_club')} saga"
        body = "\n\n".join(
            f"{r['date_logged']} — {r['evolution_description']} (source: {r['source_name']})" for r in rumors
        )
    return {"title": title, "body": body}


# ---------- AI RADAR ----------
@api_router.get("/radar/alerts")
async def get_alerts(status: Optional[str] = None):
    query = {}
    if status and status.lower() != "all":
        query["status"] = status
    docs = await db.global_alerts.find(query, {"_id": 0}).to_list(500)
    docs.sort(key=lambda a: a.get("created_at", ""), reverse=True)
    return docs


def _fallback_alert() -> dict:
    players = [
        ("Arda Güler", "Real Madrid", "Turkey"), ("Nico Paz", "Como", "Argentina"),
        ("Warren Zaïre-Emery", "PSG", "France"), ("Lamine Yamal", "Barcelona", "Spain"),
        ("Kenan Yildiz", "Juventus", "Turkey"), ("Xavi Simons", "RB Leipzig", "Netherlands"),
    ]
    p, club, country = random.choice(players)
    n = random.randint(2, 6)
    mins = random.randint(20, 90)
    score = random.choice(["High", "Medium", "Low"])
    return {
        "id": str(uuid.uuid4()), "player_name": p, "current_club": club, "flagged_country": country,
        "anomaly_score": score, "status": "New",
        "automated_summary": f"AI Alert: {n} local {country} outlets reported ongoing talks in the last {mins} mins. Frequency anomaly detected vs. baseline.",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


@api_router.post("/radar/scan")
async def radar_scan():
    known = [f"{p['full_name']} ({p['current_club']})" for p in PROFILES[:8]]
    system_message = (
        "You simulate a GLOBAL FOOTBALL MEDIA SCANNER for a transfer-rumor newsroom. You invent ONE realistic, "
        "plausible (NOT officially confirmed) breaking radar alert about a footballer being linked with a move, "
        "as if detected by a statistical anomaly in foreign-language media frequency. Respond with STRICT JSON only. "
        'Schema: {"player_name": string, "current_club": string, "flagged_country": string, '
        '"anomaly_score": "High"|"Medium"|"Low", "automated_summary": string}. The summary must be 2 lines max, '
        "start with 'AI Alert:', mention how many outlets in which country and a time window (e.g. 'last 45 mins'), "
        "and read like an automated translated brief. Keep it fresh and varied."
    )
    prompt = (
        "Generate one new radar alert. You may use a real current footballer. Avoid repeating these already-tracked "
        f"profiles verbatim: {', '.join(known)}. Make it feel like live intelligence."
    )
    try:
        alert = _extract_json(await _llm(system_message, prompt, f"radar-{uuid.uuid4()}"))
        alert["id"] = str(uuid.uuid4())
        alert["status"] = "New"
        alert.setdefault("anomaly_score", "Medium")
        alert["created_at"] = datetime.now(timezone.utc).isoformat()
        for k in ["player_name", "current_club", "flagged_country", "automated_summary"]:
            if not alert.get(k):
                raise ValueError("missing field")
    except Exception as e:
        logger.error(f"Radar scan fallback: {e}")
        alert = _fallback_alert()
    await db.global_alerts.insert_one(dict(alert))
    return alert


@api_router.post("/radar/alerts/{alert_id}/investigate")
async def investigate_alert(alert_id: str):
    alert = await db.global_alerts.find_one({"id": alert_id}, {"_id": 0})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    await db.global_alerts.update_one({"id": alert_id}, {"$set": {"status": "Investigating"}})
    # create pipeline entry
    existing = await db.pipeline.find_one({"player_name": alert["player_name"], "stage": {"$ne": None}}, {"_id": 0})
    if not existing:
        pl = {
            "id": str(uuid.uuid4()), "player_name": alert["player_name"], "target_club": "TBD",
            "source_origin": f"{alert['flagged_country']} (Radar)", "priority_tier": "B",
            "stage": "Contatti Avviati",
            "exclusive_angle_notes": alert.get("automated_summary", ""),
            "last_updated": datetime.now(timezone.utc).isoformat(),
        }
        await db.pipeline.insert_one(dict(pl))
        # auto verification tasks
        today = datetime.now(timezone.utc).date()
        tasks = [
            ("Contact agent for confirmation", 1),
            (f"Cross-check with a second {alert['flagged_country']} source", 2),
            ("Verify contract status in the profile database", 2),
        ]
        for action, days in tasks:
            await db.verification_tasks.insert_one({
                "id": str(uuid.uuid4()), "pipeline_id": pl["id"], "player_name": alert["player_name"],
                "action_required": action, "deadline": (today + timedelta(days=days)).isoformat(), "is_done": False,
            })
    return {"ok": True}


@api_router.post("/radar/alerts/{alert_id}/dismiss")
async def dismiss_alert(alert_id: str):
    res = await db.global_alerts.update_one({"id": alert_id}, {"$set": {"status": "Dismissed"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"ok": True}


# ---------- Pipeline ----------
@api_router.get("/pipeline")
async def get_pipeline():
    docs = await db.pipeline.find({}, {"_id": 0}).to_list(500)
    return docs


@api_router.patch("/pipeline/{item_id}")
async def update_pipeline(item_id: str, payload: PipelineUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    update["last_updated"] = datetime.now(timezone.utc).isoformat()
    res = await db.pipeline.update_one({"id": item_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pipeline item not found")
    return await db.pipeline.find_one({"id": item_id}, {"_id": 0})


# ---------- Verification tasks ----------
@api_router.get("/tasks")
async def get_tasks():
    docs = await db.verification_tasks.find({}, {"_id": 0}).to_list(500)
    docs.sort(key=lambda t: (t.get("is_done", False), t.get("deadline", "")))
    return docs


@api_router.post("/tasks")
async def create_task(payload: TaskCreate):
    task = {"id": str(uuid.uuid4()), **payload.model_dump(), "is_done": False}
    await db.verification_tasks.insert_one(dict(task))
    return task


@api_router.patch("/tasks/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    res = await db.verification_tasks.update_one({"id": task_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return await db.verification_tasks.find_one({"id": task_id}, {"_id": 0})


# ---------- STREAK LAB ----------
class VoteReq(BaseModel):
    challenge_id: str
    answer: str


@api_router.get("/challenges/active")
async def active_challenge():
    doc = await db.daily_challenges.find_one({"is_active": True}, {"_id": 0})
    return doc or {}


@api_router.get("/streak/me")
async def streak_me():
    doc = await db.streak_users.find_one({"id": "u-you"}, {"_id": 0})
    return doc or {"id": "u-you", "mock_username": "You", "current_streak": 0, "highest_streak": 0}


@api_router.get("/streak/leaderboard")
async def leaderboard():
    docs = await db.streak_users.find({}, {"_id": 0}).to_list(200)
    docs.sort(key=lambda u: (u.get("highest_streak", 0), u.get("current_streak", 0)), reverse=True)
    return docs[:5]


@api_router.post("/streak/vote")
async def streak_vote(payload: VoteReq):
    ch = await db.daily_challenges.find_one({"id": payload.challenge_id}, {"_id": 0})
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    user = await db.streak_users.find_one({"id": "u-you"}, {"_id": 0}) or {"current_streak": 0, "highest_streak": 0}
    correct = payload.answer.strip().upper() == str(ch["correct_answer"]).strip().upper()
    current = user.get("current_streak", 0) + 1 if correct else 0
    highest = max(user.get("highest_streak", 0), current)
    await db.streak_users.update_one(
        {"id": "u-you"},
        {"$set": {"current_streak": current, "highest_streak": highest, "mock_username": "You"}},
        upsert=True,
    )
    return {"correct": correct, "current_streak": current, "highest_streak": highest, "correct_answer": ch["correct_answer"]}


@api_router.get("/stats")
async def get_stats():
    return {
        "profiles": await db.profiles.count_documents({}),
        "rumors": await db.rumors.count_documents({}),
        "sources": await db.sources.count_documents({}),
        "hot": await db.rumors.count_documents({"stage": "Trattativa Avanzata"}),
        "official": await db.rumors.count_documents({"stage": "Fumata Bianca/Ufficiale"}),
        "alerts": await db.global_alerts.count_documents({"status": "New"}),
    }


@api_router.get("/")
async def root():
    return {"message": "MemoryTransfer API"}


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
        logger.info(f"Seeding DB to version {SEED_VERSION}")
        await db.profiles.delete_many({})
        await db.sources.delete_many({})
        await db.rumors.delete_many({})
        await db.global_alerts.delete_many({})
        await db.pipeline.delete_many({})
        await db.verification_tasks.delete_many({})
        await db.streak_users.delete_many({})
        await db.daily_challenges.delete_many({})
        prof_rows = []
        name_by_id = {}
        for p in PROFILES:
            row = dict(p)
            row["verified_status"] = row["id"] in VERIFIED_PROFILE_IDS
            name_by_id[row["id"]] = row["full_name"]
            prof_rows.append(row)
        await db.profiles.insert_many(prof_rows)
        await db.sources.insert_many([dict(s) for s in SOURCES])
        now = datetime.now(timezone.utc)
        rows = []
        for r in RUMORS:
            row = dict(r)
            ts = now - timedelta(minutes=row.pop("age_min", 0))
            row["logged_at"] = ts.isoformat()
            row["date_logged"] = ts.date().isoformat()
            row["id"] = str(uuid.uuid4())
            row["created_at"] = ts.isoformat()
            pname = name_by_id.get(row["profile_id"], "")
            row["external_link_url"] = f"https://www.google.com/search?q={quote_plus(pname + ' transfer news')}"
            rows.append(row)
        await db.rumors.insert_many(rows)
        alerts = []
        for a in GLOBAL_ALERTS:
            row = dict(a)
            row["created_at"] = (now - timedelta(minutes=row.pop("age_min", 0))).isoformat()
            if not row.get("external_link_url"):
                row["external_link_url"] = f"https://www.google.com/search?q={quote_plus(row['player_name'] + ' transfer ' + row.get('flagged_country',''))}"
            alerts.append(row)
        await db.global_alerts.insert_many(alerts)
        pls = []
        for p in PIPELINE:
            row = dict(p)
            row["last_updated"] = (now - timedelta(minutes=row.pop("age_min", 0))).isoformat()
            pls.append(row)
        await db.pipeline.insert_many(pls)
        tasks = []
        for t in VERIFICATION_TASKS:
            row = dict(t)
            row["deadline"] = (now + timedelta(days=row.pop("due_in_days", 0))).date().isoformat()
            tasks.append(row)
        await db.verification_tasks.insert_many(tasks)
        await db.streak_users.insert_many([dict(u) for u in STREAK_USERS])
        await db.daily_challenges.insert_many([dict(c) for c in DAILY_CHALLENGES])
        await db.meta.update_one({"_id": "seed"}, {"$set": {"version": SEED_VERSION}}, upsert=True)
        logger.info("Seed complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
