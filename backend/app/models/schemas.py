"""
SolVurai — Pydantic request/response models.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


# ── Enums ─────────────────────────────────────────────────

class Scenario(str, Enum):
    friends          = "friends"
    classroom        = "classroom"
    interview        = "interview"
    debate           = "debate"
    storytelling     = "storytelling"
    customer_service = "customer_service"
    teacher_student  = "teacher_student"
    family           = "family"

class Emotion(str, Enum):
    happy        = "happy"
    angry        = "angry"
    respectful   = "respectful"
    emotional    = "emotional"
    confident    = "confident"
    sad          = "sad"
    motivational = "motivational"

class DialogueStyle(str, Enum):
    spoken     = "spoken"
    formal     = "formal"
    literary   = "literary"
    simplified = "simplified"

class Difficulty(str, Enum):
    beginner     = "beginner"
    intermediate = "intermediate"
    advanced     = "advanced"


# ── Generate ──────────────────────────────────────────────

class GenerateRequest(BaseModel):
    scenario:   Scenario
    emotion:    Emotion
    style:      DialogueStyle
    difficulty: Difficulty
    topic:      Optional[str] = None
    turns:      Optional[int] = Field(default=6, ge=2, le=12)

class DialogueLine(BaseModel):
    speaker:         str
    text:            str
    transliteration: Optional[str] = None
    translation:     Optional[str] = None

class GenerateResponse(BaseModel):
    dialogue:   List[DialogueLine]
    title:      str
    topic_used: str
    raw_text:   str


# ── Transform ─────────────────────────────────────────────

class TransformRequest(BaseModel):
    dialogue:   str
    from_style: DialogueStyle
    to_style:   DialogueStyle

class TransformResponse(BaseModel):
    transformed:  str
    changes_made: List[str]


# ── Emotion ───────────────────────────────────────────────

class EmotionRequest(BaseModel):
    dialogue:       str
    target_emotion: Emotion

class EmotionResponse(BaseModel):
    adapted:       str
    emotion_notes: str


# ── Grammar ───────────────────────────────────────────────

class GrammarRequest(BaseModel):
    dialogue: str

class GrammarScore(BaseModel):
    grammar:    int
    fluency:    int
    vocabulary: int
    formality:  int
    overall:    int

class GrammarInsight(BaseModel):
    category: str
    finding:  str
    example:  str
    tip:      str

class GrammarResponse(BaseModel):
    scores:                  GrammarScore
    insights:                List[GrammarInsight]
    tense_used:              List[str]
    sentence_patterns:       List[str]
    vocabulary_highlights:   List[str]
