from fastapi import APIRouter, HTTPException
from app.models.schemas import EmotionRequest, EmotionResponse
from app.services.gemini_service import adapt_emotion

router = APIRouter()

@router.post("/emotion", response_model=EmotionResponse)
async def emotion(req: EmotionRequest):
    try:
        return await adapt_emotion(
            dialogue=req.dialogue,
            target_emotion=req.target_emotion,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion adaptation failed: {str(e)}")
