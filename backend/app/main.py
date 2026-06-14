"""
SolVurai — FastAPI Backend
Entry point: initializes app, CORS, routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.routes import generate, transform, emotion, grammar, health

settings = get_settings()

app = FastAPI(
    title="SolVurai API",
    description="AI-powered Tamil Dialogue & Expression Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────
app.include_router(health.router,    prefix="/api")
app.include_router(generate.router,  prefix="/api")
app.include_router(transform.router, prefix="/api")
app.include_router(emotion.router,   prefix="/api")
app.include_router(grammar.router,   prefix="/api")

@app.get("/")
async def root():
    return {
        "app":     "SolVurai",
        "tamil":   "சொல்வுரை",
        "version": "1.0.0",
        "status":  "running",
    }
