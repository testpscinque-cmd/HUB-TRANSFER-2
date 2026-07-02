from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage

from seed_data import PROFILES, SOURCES, RUMORS

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
class Profile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    role: str = "Player"
    position: Optional[str] = ""
    current_club: Optional[str] = ""
    contract_expiry: Optional[str] = ""
    estimated_salary: Optional[str] = ""
    representation_agency: Optional[str] = ""
    nationality: Optional[str] = ""
    age: Optional[int] = None
    internal_notes: Optional[str] = ""
    image: Optional[str] = ""


class ProfileCreate(BaseModel):
    full_name: str
    role: str = "Player"
    position: Optional[str] = ""
    current_club: Optional[str] = ""
    contract_expiry: Optional[str] = ""
    estimated_salary: Optional[str] = ""
    representation_agency: Optional[str] = ""
    nationality: Optional[str] = ""
    age: Optional[int] = None
    internal_notes: Optional[str] = ""
    image: Optional[str] = ""


class Rumor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    profile_id: str
    date_logged: str
    stage: str
    source_name: str
    deal_formula: Optional[str] = ""
    evolution_description: str
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


class SourceCreate(BaseModel):
    source_name: str
    reliability_score: int = 50
    notes: Optional[str] = ""


class ConsistencyRequest(BaseModel):
    profile_id: str
    stage: str
    source_name: str
    deal_formula: Optional[str] = ""
    evolution_description: str


# ---------- Profiles ----------
@api_router.get("/profiles", response_model=List[Profile])
async def get_profiles(q: Optional[str] = None):
    query = {}
    if q:
        query = {"full_name": {"$regex": re.escape(q), "$options": "i"}}
    docs = await db.profiles.find(query, {"_id": 0}).to_list(500)
    return docs


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


@api_router.post("/rumors", response_model=Rumor)
async def create_rumor(payload: RumorCreate):
    obj = Rumor(**payload.model_dump())
    await db.rumors.insert_one(obj.model_dump())
    return obj


# ---------- Sources ----------
@api_router.get("/sources", response_model=List[Source])
async def get_sources():
    docs = await db.sources.find({}, {"_id": 0}).to_list(500)
    docs.sort(key=lambda s: s.get("reliability_score", 0), reverse=True)
    return docs


@api_router.post("/sources", response_model=Source)
async def create_source(payload: SourceCreate):
    obj = Source(**payload.model_dump())
    await db.sources.insert_one(obj.model_dump())
    return obj


# ---------- AI Consistency Checker ----------
def _extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    return json.loads(text)


@api_router.post("/consistency-check")
async def consistency_check(payload: ConsistencyRequest):
    profile = await db.profiles.find_one({"id": payload.profile_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    source = await db.sources.find_one({"source_name": payload.source_name}, {"_id": 0})
    reliability = source.get("reliability_score") if source else None

    system_message = (
        "You are the Consistency Auditor for a professional football (soccer) transfer-market "
        "intelligence desk used by sports journalists. You cross-check an incoming transfer rumor "
        "against the verified profile database and flag logical contradictions before publication. "
        "Focus on hard factual contradictions such as: a 'free transfer' or 'expiring contract' claim "
        "while the database shows the contract runs for one or more years; a wrong current club; a deal "
        "formula that conflicts with contractual reality; or a low-reliability source making a strong "
        "official claim. Today's reference date is 2025-07-05. "
        "Respond with STRICT JSON only, no prose, no markdown fences. Schema: "
        '{"has_contradiction": boolean, "severity": "none"|"low"|"medium"|"high", '
        '"message_en": string, "message_it": string, "advice_en": string, "advice_it": string}. '
        "Keep each message under 240 characters. message_it must be natural Italian."
    )

    prompt = (
        f"VERIFIED PROFILE DATABASE:\n"
        f"- Name: {profile.get('full_name')}\n"
        f"- Role: {profile.get('role')}\n"
        f"- Current club: {profile.get('current_club')}\n"
        f"- Contract expiry: {profile.get('contract_expiry')}\n"
        f"- Estimated salary: {profile.get('estimated_salary')}\n"
        f"- Agency: {profile.get('representation_agency')}\n"
        f"- Internal notes: {profile.get('internal_notes')}\n\n"
        f"INCOMING RUMOR TO AUDIT:\n"
        f"- Stage: {payload.stage}\n"
        f"- Source: {payload.source_name} (reliability score: {reliability if reliability is not None else 'unknown'}/100)\n"
        f"- Deal formula: {payload.deal_formula}\n"
        f"- Description: {payload.evolution_description}\n\n"
        f"Audit the rumor against the database and return the JSON verdict."
    )

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"consistency-{payload.profile_id}",
            system_message=system_message,
        ).with_model("anthropic", "claude-sonnet-4-6")
        response = await chat.send_message(UserMessage(text=prompt))
        result = _extract_json(response if isinstance(response, str) else str(response))
    except Exception as e:
        logger.error(f"Consistency check failed: {e}")
        return {
            "has_contradiction": False,
            "severity": "none",
            "message_en": "AI audit unavailable right now. Please verify the rumor manually.",
            "message_it": "Controllo AI non disponibile ora. Verifica manualmente il rumor.",
            "advice_en": "",
            "advice_it": "",
            "error": True,
        }

    result.setdefault("has_contradiction", False)
    result.setdefault("severity", "none")
    result.setdefault("message_en", "")
    result.setdefault("message_it", "")
    result.setdefault("advice_en", "")
    result.setdefault("advice_it", "")
    return result


@api_router.get("/stats")
async def get_stats():
    profiles = await db.profiles.count_documents({})
    rumors = await db.rumors.count_documents({})
    sources = await db.sources.count_documents({})
    hot = await db.rumors.count_documents({"stage": "Trattativa Avanzata"})
    official = await db.rumors.count_documents({"stage": "Fumata Bianca/Ufficiale"})
    return {"profiles": profiles, "rumors": rumors, "sources": sources, "hot": hot, "official": official}


@api_router.get("/")
async def root():
    return {"message": "TransferMemory API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_db():
    if await db.profiles.count_documents({}) == 0:
        await db.profiles.insert_many([dict(p) for p in PROFILES])
        logger.info("Seeded profiles")
    if await db.sources.count_documents({}) == 0:
        await db.sources.insert_many([dict(s) for s in SOURCES])
        logger.info("Seeded sources")
    if await db.rumors.count_documents({}) == 0:
        rows = []
        for r in RUMORS:
            row = dict(r)
            row.setdefault("created_at", datetime.now(timezone.utc).isoformat())
            rows.append(row)
        await db.rumors.insert_many(rows)
        logger.info("Seeded rumors")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
