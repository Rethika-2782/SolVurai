from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import generate, transform, emotion, grammar, health

app = FastAPI(title="SolVurai API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router,    prefix="/api")
app.include_router(generate.router,  prefix="/api")
app.include_router(transform.router, prefix="/api")
app.include_router(emotion.router,   prefix="/api")
app.include_router(grammar.router,   prefix="/api")

@app.get("/")
async def root():
    return {"app": "SolVurai", "tamil": "சொல்வுரை", "version": "1.0.0", "status": "running"}
