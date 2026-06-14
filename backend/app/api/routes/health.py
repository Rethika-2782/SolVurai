from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "status":    "healthy",
        "app":       "SolVurai",
        "tamil":     "சொல்வுரை",
        "timestamp": datetime.utcnow().isoformat(),
    }
