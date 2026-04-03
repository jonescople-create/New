from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import bcrypt
import jwt as pyjwt
import psutil
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_jwt_secret():
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access"
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


DEFAULT_SETTINGS = {
    "aura_intensity": 0.5,
    "color_shift_mode": "static",
    "accent_color": "#9D4CDD",
    "transparency": 0.8,
    "system_wide_aura": True,
    "wallpaper_color_match": False,
    "wallpaper_index": 0
}


class RegisterInput(BaseModel):
    email: str
    password: str
    name: str


class LoginInput(BaseModel):
    email: str
    password: str


class SettingsInput(BaseModel):
    aura_intensity: Optional[float] = None
    color_shift_mode: Optional[str] = None
    accent_color: Optional[str] = None
    transparency: Optional[float] = None
    system_wide_aura: Optional[bool] = None
    wallpaper_color_match: Optional[bool] = None
    wallpaper_index: Optional[int] = None


# Auth endpoints
@api_router.post("/auth/register")
async def register(input_data: RegisterInput, response: Response):
    email = input_data.email.lower().strip()
    if not email or not input_data.password or len(input_data.password) < 4:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(input_data.password)
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": input_data.name,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "settings": {**DEFAULT_SETTINGS}
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": user_id, "email": email, "name": input_data.name, "role": "user", "settings": user_doc["settings"]}


@api_router.post("/auth/login")
async def login(input_data: LoginInput, response: Response):
    email = input_data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {
        "id": user_id, "email": user["email"], "name": user.get("name", ""),
        "role": user.get("role", "user"), "settings": user.get("settings", DEFAULT_SETTINGS)
    }


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user_id = str(user["_id"])
        access_token = create_access_token(user_id, user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"message": "Token refreshed"}
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# User settings
@api_router.get("/settings")
async def get_settings(request: Request):
    user = await get_current_user(request)
    return user.get("settings", DEFAULT_SETTINGS)


@api_router.put("/settings")
async def update_settings(settings: SettingsInput, request: Request):
    user = await get_current_user(request)
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    if update_data:
        set_fields = {f"settings.{k}": v for k, v in update_data.items()}
        await db.users.update_one({"_id": ObjectId(user["_id"])}, {"$set": set_fields})
    updated_user = await db.users.find_one({"_id": ObjectId(user["_id"])}, {"_id": 0, "settings": 1})
    return updated_user.get("settings", DEFAULT_SETTINGS)


# System info
@api_router.get("/system/info")
async def get_system_info(request: Request):
    await get_current_user(request)
    cpu_percent = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    return {
        "cpu": {"percent": cpu_percent, "count": psutil.cpu_count()},
        "memory": {"total": memory.total, "used": memory.used, "percent": memory.percent},
        "disk": {"total": disk.total, "used": disk.used, "percent": disk.percent}
    }


@api_router.get("/system/processes")
async def get_processes(request: Request):
    await get_current_user(request)
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            info = proc.info
            processes.append({
                "pid": info['pid'],
                "name": info['name'] or "unknown",
                "cpu": info['cpu_percent'] or 0,
                "memory": round(info['memory_percent'] or 0, 1)
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    processes.sort(key=lambda x: x['cpu'], reverse=True)
    return processes[:50]


# File browser (virtual filesystem)
VIRTUAL_FS = {
    "/": [
        {"name": "Documents", "is_directory": True},
        {"name": "Pictures", "is_directory": True},
        {"name": "Music", "is_directory": True},
        {"name": "Videos", "is_directory": True},
        {"name": "Downloads", "is_directory": True},
    ],
    "/Documents": [
        {"name": "report.pdf", "is_directory": False, "size": 245760},
        {"name": "notes.txt", "is_directory": False, "size": 1024},
        {"name": "project_plan.md", "is_directory": False, "size": 4096},
        {"name": "budget.xlsx", "is_directory": False, "size": 51200},
    ],
    "/Pictures": [
        {"name": "wallpaper.jpg", "is_directory": False, "size": 2097152},
        {"name": "screenshot.png", "is_directory": False, "size": 524288},
        {"name": "avatar.png", "is_directory": False, "size": 102400},
    ],
    "/Music": [
        {"name": "ambient_mix.mp3", "is_directory": False, "size": 8388608},
        {"name": "playlist.m3u", "is_directory": False, "size": 512},
    ],
    "/Videos": [
        {"name": "tutorial.mp4", "is_directory": False, "size": 52428800},
        {"name": "presentation.mov", "is_directory": False, "size": 31457280},
    ],
    "/Downloads": [
        {"name": "archive.zip", "is_directory": False, "size": 10485760},
        {"name": "readme.txt", "is_directory": False, "size": 2048},
    ],
}


@api_router.get("/files/browse")
async def browse_files(request: Request, path: str = "/"):
    await get_current_user(request)
    items = VIRTUAL_FS.get(path, [])
    entries = []
    for item in items:
        entry_path = f"{path.rstrip('/')}/{item['name']}"
        entries.append({
            "name": item["name"],
            "path": entry_path,
            "is_directory": item["is_directory"],
            "size": item.get("size", 0),
            "modified": datetime.now(timezone.utc).isoformat()
        })
    return {"path": path, "entries": entries}


# Wallpapers
WALLPAPERS = [
    {"id": 0, "url": "https://images.unsplash.com/photo-1680486481682-6828194ec366?w=1920&q=80", "name": "Cosmic Nebula"},
    {"id": 1, "url": "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80", "name": "Dark Galaxy"},
    {"id": 2, "url": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80", "name": "Purple Nebula"},
    {"id": 3, "url": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80", "name": "Starfield"},
]


@api_router.get("/wallpapers")
async def get_wallpapers(request: Request):
    await get_current_user(request)
    return WALLPAPERS


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@auraos.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "aura2024")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "settings": {**DEFAULT_SETTINGS}
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write(f"## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n")
        f.write("## Auth Endpoints\n- POST /api/auth/register\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n- POST /api/auth/refresh\n")
        f.write("\n## Other Endpoints\n- GET /api/settings\n- PUT /api/settings\n- GET /api/system/info\n- GET /api/system/processes\n- GET /api/files/browse\n- GET /api/wallpapers\n")


@app.on_event("shutdown")
async def shutdown():
    client.close()
