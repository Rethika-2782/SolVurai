from fastapi import APIRouter, HTTPException
from app.models.schemas import GenerateRequest, GenerateResponse
from app.services.gemini_service import generate_dialogue

router = APIRouter()

@router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    try:
        return await generate_dialogue(
            scenario=req.scenario,
            emotion=req.emotion,
            style=req.style,
            difficulty=req.difficulty,
            topic=req.topic,
            turns=req.turns or 6,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
