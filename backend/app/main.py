import uuid
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .data import PERSONAS
from .chat_bot import ChatBot
from .models import (
    CreateSessionRequest,
    MessageRequest,
    SessionResponse,
    ChatResponse,
    UsageResponse,
)

from dotenv import load_dotenv

load_dotenv()

# In production, replace with Redis or a database
sessions: dict[str, ChatBot] = {}


def _get_session(session_id: str) -> ChatBot:
    bot = sessions.get(session_id)
    if not bot:
        raise HTTPException(status_code=404, detail=f"Session '{session_id}' not found.")
    return bot


app = FastAPI(title="ChatBot Creator API", root_path="/api")

# CORS - allows the frontend container to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()


@app.get("/personas")
def list_personas():
    """Return all available predefined personas."""
    return {"personas": list(PERSONAS.keys())}


@app.post("/sessions", response_model=SessionResponse)
def create_session(request: CreateSessionRequest):
    """
    Create a new chatbot session. Either pass a persona name, or provide
    a custom model + system_prompt for a fully custom bot.
    """
    if request.persona:
        if request.persona not in PERSONAS:
            raise HTTPException(status_code=404, detail=f"Persona '{request.persona}' not found.")
        config = PERSONAS[request.persona]
        bot = ChatBot(**config)
        model = config["model"]
    else:
        if not request.model or not request.system_prompt:
            raise HTTPException(
                status_code=400,
                detail="Provide either a persona or both model and system_prompt.",
            )
        bot = ChatBot(
            model=request.model,
            max_tokens=request.max_tokens,
            system_prompt=request.system_prompt,
            temperature=request.temperature,
            cache_system_prompt=request.cache_system_prompt,
        )
        model = request.model

    session_id = str(uuid.uuid4())
    sessions[session_id] = bot

    return SessionResponse(session_id=session_id, persona=request.persona, model=model)


@app.post("/chat", response_model=ChatResponse)
def chat(request: MessageRequest):
    """Send a message to a bot session and get a full response."""
    bot = _get_session(request.session_id)

    if request.stream:
        # Return a streaming response
        return StreamingResponse(bot.stream_chat(request.message), media_type="text/plain")

    response = bot.chat(request.message)
    return ChatResponse(session_id=request.session_id, response=response)


@app.get("/sessions/{session_id}/usage", response_model=UsageResponse)
def get_usage(session_id: str):
    """Get token usage and cost summary for a session."""
    bot = _get_session(session_id)
    return UsageResponse(session_id=session_id, usage=bot.get_usage_summary())


@app.delete("/sessions/{session_id}/reset")
def reset_session(session_id: str):
    """Clear the conversation history for a session without deleting it."""
    bot = _get_session(session_id)
    bot.reset()
    return {"message": f"Session {session_id} reset successfully."}


@app.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    """Fully delete a session."""
    _get_session(session_id)
    del sessions[session_id]
    return {"message": f"Session {session_id} deleted."}


app.include_router(router)
