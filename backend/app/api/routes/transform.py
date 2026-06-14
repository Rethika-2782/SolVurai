from fastapi import APIRouter, HTTPException
from app.models.schemas import TransformRequest, TransformResponse
from app.services.gemini_service import transform_style

router = APIRouter()

@router.post("/transform", response_model=TransformResponse)
async def transform(req: TransformRequest):
    try:
        return await transform_style(
            dialogue=req.dialogue,
            from_style=req.from_style,
            to_style=req.to_style,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transformation failed: {str(e)}")
