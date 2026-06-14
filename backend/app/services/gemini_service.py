"""
SolVurai — AI Service using Groq (Free, Fast, No quota issues)
Groq gives 14,400 free requests/day — way more than Gemini free tier!
Model: llama-3.3-70b-versatile
"""

import json
import re
import httpx
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

from app.models.schemas import (
    Scenario, Emotion, DialogueStyle, Difficulty,
    GenerateResponse, DialogueLine,
    TransformResponse, EmotionResponse,
    GrammarResponse, GrammarScore, GrammarInsight,
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

SCENARIO_CONTEXT = {
    "friends":          "two close friends having a casual conversation",
    "classroom":        "students and teacher in an educational setting",
    "interview":        "a job interview between interviewer and candidate",
    "debate":           "two speakers debating opposing viewpoints",
    "storytelling":     "someone narrating a story with a listener",
    "customer_service": "a customer and service representative interaction",
    "teacher_student":  "a teacher guiding a student",
    "family":           "family members having a warm home conversation",
}

EMOTION_GUIDANCE = {
    "happy":        "Cheerful, upbeat vocabulary. Light joyful sentences.",
    "angry":        "Sharp clipped sentences. Strong frustrated tone.",
    "respectful":   "Honorific forms (நீங்கள்). Polite formal address.",
    "emotional":    "Deep feeling. Long weighted sentences. Heartfelt.",
    "confident":    "Direct assertive. Short powerful sentences.",
    "sad":          "Slow reflective. Melancholic vocabulary.",
    "motivational": "Inspiring energetic. Powerful metaphors. Uplifting.",
}

STYLE_DESCRIPTION = {
    "spoken":     "Everyday spoken Tamil (பேச்சு வழக்கு) — colloquial, natural",
    "formal":     "Formal written Tamil (உயர் வழக்கு) — official, professional",
    "literary":   "Classical literary Tamil (இலக்கிய நடை) — elevated vocabulary",
    "simplified": "Simple Tamil (எளிய தமிழ்) — short sentences, basic words",
}

DIFFICULTY_GUIDANCE = {
    "beginner":     "Simple vocabulary, short sentences, common everyday words only",
    "intermediate": "Mix of common and some complex vocabulary",
    "advanced":     "Rich vocabulary, complex grammar, idiomatic expressions",
}


def _extract_json(text: str) -> dict:
    text = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON in response: {text[:200]}")
    return json.loads(match.group())


async def _call_groq(prompt: str) -> str:
    """Call Groq API with the given prompt."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set in .env file")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.85,
                "max_tokens": 2048,
            }
        )
        
        if response.status_code == 429:
            raise ValueError("429_QUOTA")
        
        if not response.is_success:
            raise ValueError(f"Groq API error {response.status_code}: {response.text}")
        
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def generate_dialogue(
    scenario: Scenario,
    emotion: Emotion,
    style: DialogueStyle,
    difficulty: Difficulty,
    topic: Optional[str],
    turns: int = 6,
) -> GenerateResponse:

    topic_line = f"Topic: {topic}" if topic else "Choose a natural interesting topic."

    prompt = f"""You are an expert Tamil language AI. Generate a realistic Tamil dialogue.

SPECIFICATIONS:
- Scenario: {SCENARIO_CONTEXT[scenario]}
- Emotion: {EMOTION_GUIDANCE[emotion]}
- Style: {STYLE_DESCRIPTION[style]}
- Difficulty: {DIFFICULTY_GUIDANCE[difficulty]}
- Turns: {turns}
- {topic_line}

CRITICAL RULE:
- Input topic may be English or Tanglish — always generate dialogue ENTIRELY in Tamil script
- NO English words in dialogue lines at all

OUTPUT (valid JSON only, no other text before or after):
{{
  "title": "Short English title",
  "topic_used": "The topic",
  "dialogue": [
    {{
      "speaker": "TamilName",
      "text": "Tamil script dialogue here",
      "translation": "English translation"
    }}
  ]
}}"""

    text = await _call_groq(prompt)
    data = _extract_json(text)
    lines = [
        DialogueLine(
            speaker=line["speaker"],
            text=line["text"],
            translation=line.get("translation"),
        )
        for line in data["dialogue"]
    ]
    return GenerateResponse(
        dialogue=lines,
        title=data.get("title", "Tamil Dialogue"),
        topic_used=data.get("topic_used", topic or "General"),
        raw_text="\n".join(f"{l.speaker}: {l.text}" for l in lines),
    )


async def transform_style(
    dialogue: str,
    from_style: DialogueStyle,
    to_style: DialogueStyle,
) -> TransformResponse:

    prompt = f"""You are an expert Tamil linguist.

Transform this dialogue from {from_style.upper()} to {to_style.upper()} style.

FROM: {STYLE_DESCRIPTION[from_style]}
TO:   {STYLE_DESCRIPTION[to_style]}

DIALOGUE:
{dialogue}

RULES:
- Input may be English or Tanglish — output MUST be Tamil script only
- Preserve exact meaning, only change style
- List key changes made

OUTPUT (valid JSON only):
{{
  "transformed": "Full transformed Tamil dialogue here",
  "changes_made": ["Change 1", "Change 2"]
}}"""

    text = await _call_groq(prompt)
    data = _extract_json(text)
    return TransformResponse(
        transformed=data["transformed"],
        changes_made=data.get("changes_made", []),
    )


async def adapt_emotion(
    dialogue: str,
    target_emotion: Emotion,
) -> EmotionResponse:

    prompt = f"""You are a Tamil emotion language specialist.

Adapt this dialogue to express the {target_emotion.upper()} emotion strongly.

EMOTION GUIDANCE: {EMOTION_GUIDANCE[target_emotion]}

DIALOGUE:
{dialogue}

RULES:
- Input may be English or Tanglish — output MUST be Tamil script only
- Keep the same events and meaning
- Change vocabulary, tone and rhythm to match the emotion
- Preserve speaker names

OUTPUT (valid JSON only):
{{
  "adapted": "Full emotionally adapted Tamil dialogue",
  "emotion_notes": "Brief explanation of emotional changes"
}}"""

    text = await _call_groq(prompt)
    data = _extract_json(text)
    return EmotionResponse(
        adapted=data["adapted"],
        emotion_notes=data.get("emotion_notes", ""),
    )


async def analyze_grammar(dialogue: str) -> GrammarResponse:

    prompt = f"""You are an expert Tamil grammarian and linguist.

Analyze this Tamil text for grammar, fluency, vocabulary and formality.
Input may be English or Tanglish — analyze as Tamil.

TEXT:
{dialogue}

OUTPUT (valid JSON only, all scores 0-100):
{{
  "scores": {{
    "grammar": 85,
    "fluency": 78,
    "vocabulary": 72,
    "formality": 80,
    "overall": 79
  }},
  "insights": [
    {{
      "category": "Tense Usage",
      "finding": "Description of finding",
      "example": "Tamil example from text",
      "tip": "How to improve"
    }}
  ],
  "tense_used": ["இறந்தகாலம் (Past)"],
  "sentence_patterns": ["Subject-Object-Verb"],
  "vocabulary_highlights": ["அழகான சொல்"]
}}"""

    text = await _call_groq(prompt)
    data = _extract_json(text)
    return GrammarResponse(
        scores=GrammarScore(**data["scores"]),
        insights=[GrammarInsight(**i) for i in data.get("insights", [])],
        tense_used=data.get("tense_used", []),
        sentence_patterns=data.get("sentence_patterns", []),
        vocabulary_highlights=data.get("vocabulary_highlights", []),
    )