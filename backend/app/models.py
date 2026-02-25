from typing import Optional
from pydantic import BaseModel


# ── Request / Response models ──────────────────────────────────────────────────
class CreateSessionRequest(BaseModel):
    persona: Optional[str] = None  # use a predefined persona, OR...
    model: Optional[str] = None  # provide custom config
    max_tokens: Optional[int] = 1000
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.5
    cache_system_prompt: Optional[bool] = False


class MessageRequest(BaseModel):
    session_id: str
    message: str
    stream: Optional[bool] = False


class SessionResponse(BaseModel):
    session_id: str
    persona: Optional[str]
    model: str


class ChatResponse(BaseModel):
    session_id: str
    response: str


class UsageResponse(BaseModel):
    session_id: str
    usage: dict
