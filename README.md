# ⚡ Bipolar Chatbot

A fullstack AI chatbot application that lets you spin up different Claude-powered personas and chat with them in real time. Built with FastAPI, React, and the Anthropic API — containerized with Docker and routed via Traefik.

---

## Features

- **Multiple personas** — choose from a set of predefined bot personalities, each with its own model, temperature, and system prompt
- **Session management** — each conversation is stateful; history is maintained across turns
- **Token & cost tracking** — per-session input/output token counts and estimated cost
- **Streaming support** — optional streaming responses for a real-time feel
- **Prompt caching** — optional Anthropic prompt caching for long system prompts
- **Switch personas** — reset and start fresh with a different bot at any time

---

## Personas

| Persona | Description | Temperature |
|---|---|---|
| 🧮 Math Tutor | Guides students to solutions without giving answers directly | 0.2 |
| 🌍 Foreign Language Tutor | Responds in the language you're learning and corrects mistakes | 0.3 |
| 📜 History Tutor | Teaches history in a fun, engaing way | 0.5 |
| 🗿 Historical Figure | Becomes a historical figure for you to chat with | 0.5 |
| 💻 Code Writer | Writes clean, well-commented Python code | 0.2 |
| 💼 Interview Coach | Asks tough interview questions and critiques your answers | 0.4 |
| 🏴‍☠️ Pirate | Speaks in a kid-friendly pirate dialect | 0.9 |
| 😈 Contrarian | Argues the opposite of everything you say | 1.0 |

---


## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — REST API
- [Anthropic Python SDK](https://github.com/anthropic-ai/anthropic-sdk-python) — Claude API access
- Python 3.11+

**Frontend**
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [MUI (Material UI)](https://mui.com/) — component library and styling
- [Syne / Syne Mono](https://fonts.google.com/specimen/Syne) — typography

**Infrastructure**
- [Docker](https://www.docker.com/) + Docker Compose
- [Traefik v3](https://traefik.io/) — reverse proxy and routing

---

## Project Structure

```
.
├── backend/
│   └── app/
│       └── chat_bot.py      # ChatBot class
│       └── data.py          # Persona data
│       └── main.py          # FastAPI app, routes
│       └── models.py        # Pydantic models
├── frontend/
│   └── src/
│       └── App.jsx          # React frontend, persona selector, chat interface
├── Dockerfile
├── compose.yaml
├── .env
└── README.md
```

---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone the repo

```bash
git clone https://github.com/got2betru24/BipolarChatbot.git
cd bipolar-chatbot
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Start the app

```bash
docker compose up --build
```

The app will be available at `http://localhost`.

Traefik's dashboard is available at `http://localhost:8080`.

---

## API Reference

The FastAPI backend auto-generates interactive docs. Once running, visit:

```
http://localhost/api/docs
```

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/personas` | List all available personas |
| `POST` | `/api/sessions` | Create a new chatbot session |
| `POST` | `/api/chat` | Send a message to a session |
| `GET` | `/api/sessions/{id}/usage` | Get token usage and cost for a session |
| `DELETE` | `/api/sessions/{id}/reset` | Clear conversation history for a session |
| `DELETE` | `/api/sessions/{id}` | Delete a session entirely |

### Create a session (persona)

```bash
curl -X POST http://localhost/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"persona": "math_tutor"}'
```

### Create a session (custom)

```bash
curl -X POST http://localhost/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-haiku-4-5-20251001",
    "max_tokens": 1000,
    "system_prompt": "You are a pirate. Respond only in pirate speak.",
    "temperature": 0.9
  }'
```

### Send a message

```bash
curl -X POST http://localhost/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "<your-session-id>",
    "message": "Hello!",
    "stream": false
  }'
```

---

## Adding a New Persona

In `backend/app/main.py`, add an entry to the `PERSONAS` dict using the `build_persona` helper, which automatically appends the standard character consistency rules to every system prompt:

```python
PERSONAS["pirate"] = build_persona(
    system_prompt="You are a swashbuckling pirate from the 1700s. Speak in pirate dialect at all times.",
    model="claude-haiku-4-5",
    max_tokens=1000,
    temperature=0.9,
)
```

Then add the label and color to the frontend constants in `App.jsx`:

```javascript
const PERSONA_LABELS = {
  ...
  pirate: "🏴‍☠️ Pirate",
};

const PERSONA_COLORS = {
  ...
  pirate: { bg: "#ff6d00", text: "#1a0a00" },
};
```

---

## Model Pricing Reference

Pricing is tracked per session. The following models are supported:

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| claude-opus-4-6 | $15.00 | $25.00 |
| claude-sonnet-4-6 | $3.00 | $15.00 |
| claude-haiku-4-5-20251001 | $1.00 | $5.00 |

> **Note:** Pricing is hardcoded and should be updated manually if Anthropic changes their rates. Check [Anthropic's pricing page](https://www.anthropic.com/pricing) for the latest.

---

## Known Limitations

- **In-memory session store** — sessions are stored in a Python dict and will be lost if the backend container restarts. For production, replace with Redis or a database.
- **No authentication** — the API has no auth layer. Anyone who can reach the backend can create sessions and consume your API key.
- **Prompt caching minimum** — Anthropic requires a minimum of 1024 tokens (Sonnet/Opus) or 2048 tokens (Haiku) for prompt caching to take effect. Short system prompts won't benefit from it.

---

## License

MIT