from fastapi import APIRouter, HTTPException
from app.models.schemas import GrammarRequest, GrammarResponse
from app.services.gemini_service import analyze_grammar

router = APIRouter()

@router.post("/grammar", response_model=GrammarResponse)
async def grammar(req: GrammarRequest):
    try:
        return await analyze_grammar(dialogue=req.dialogue)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Grammar analysis failed: {str(e)}")
