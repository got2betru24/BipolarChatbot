import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SendIcon from "@mui/icons-material/Send";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import BoltIcon from "@mui/icons-material/Bolt";


const PERSONA_LABELS = {
  math_tutor: "🧮 Math Tutor",
  foreign_language_tutor: "🌍 Language Tutor",
  history_tutor: "📜 History Tutor",
  historical_figure: "🗿 Chat with a Historical Figure",
  code_writer: "💻 Code Writer",
  interview_coach: "💼 Interview Coach",
  pirate: "🏴‍☠️ Chat with a Swashbuckling Pirate",
  contrarian: "😈 Chat with a Contrarian",
};

const PERSONA_COLORS = {
  math_tutor: { bg: "#00e5ff", text: "#003344" },
  foreign_language_tutor: { bg: "#ff9100", text: "#2d1a00" },
  history_tutor: { bg: "#d500f9", text: "#fff" },
  historical_figure: { bg: "#ffd600", text: "#2a1f00" },
  code_writer: { bg: "#00e676", text: "#001a0d" },
  interview_coach: { bg: "#76ff03", text: "#1a2200" },
  pirate: { bg: "#ff6d00", text: "#1a0a00" },
  contrarian: { bg: "#ff1744", text: "#fff" },
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0a0a0f", paper: "#13131f" },
    primary: { main: "#ff4081" },
    secondary: { main: "#00e5ff" },
  },
  typography: {
    fontFamily: "'Syne', sans-serif",
    h1: { fontFamily: "'Syne Mono', monospace", letterSpacing: "-0.03em" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

function GlitchText({ text }) {
  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2.5rem", md: "4rem" },
          fontFamily: "'Syne Mono', monospace",
          color: "#fff",
          position: "relative",
          "&::before": {
            content: `"${text}"`,
            position: "absolute",
            top: 0,
            left: "2px",
            color: "#ff4081",
            clipPath: "polygon(0 30%, 100% 30%, 100% 50%, 0 50%)",
            animation: "glitch1 3s infinite",
          },
          "&::after": {
            content: `"${text}"`,
            position: "absolute",
            top: 0,
            left: "-2px",
            color: "#00e5ff",
            clipPath: "polygon(0 60%, 100% 60%, 100% 75%, 0 75%)",
            animation: "glitch2 3s infinite",
          },
          "@keyframes glitch1": {
            "0%, 90%, 100%": { opacity: 0 },
            "92%": { opacity: 1, transform: "translateX(3px)" },
            "94%": { opacity: 1, transform: "translateX(-3px)" },
            "96%": { opacity: 0 },
          },
          "@keyframes glitch2": {
            "0%, 85%, 100%": { opacity: 0 },
            "87%": { opacity: 1, transform: "translateX(-3px)" },
            "89%": { opacity: 1, transform: "translateX(3px)" },
            "91%": { opacity: 0 },
          },
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function Message({ role, content, personaColor }) {
  const isUser = role === "user";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        gap: 1,
        alignItems: "flex-end",
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: personaColor?.bg || "#ff4081",
            color: personaColor?.text || "#fff",
            width: 34,
            height: 34,
            fontSize: "1rem",
            flexShrink: 0,
            border: `2px solid ${personaColor?.bg || "#ff4081"}`,
            boxShadow: `0 0 12px ${personaColor?.bg || "#ff4081"}88`,
          }}
        >
          <PsychologyAltIcon fontSize="small" />
        </Avatar>
      )}
      <Paper
        elevation={0}
        sx={{
          px: 2.5,
          py: 1.5,
          maxWidth: "72%",
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          background: isUser
            ? "linear-gradient(135deg, #ff4081, #f50057)"
            : "rgba(255,255,255,0.06)",
          border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          boxShadow: isUser
            ? "0 4px 20px rgba(255,64,129,0.3)"
            : "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: isUser ? "#fff" : "rgba(255,255,255,0.9)",
            whiteSpace: "pre-wrap",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {content}
        </Typography>
      </Paper>
      {isUser && (
        <Avatar
          sx={{
            bgcolor: "#ff4081",
            width: 34,
            height: 34,
            fontSize: "0.8rem",
            flexShrink: 0,
            border: "2px solid #ff4081",
            boxShadow: "0 0 12px #ff408188",
          }}
        >
          U
        </Avatar>
      )}
    </Box>
  );
}

function PersonaSelector({ onSelect }) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: selected }),
      });
      const data = await res.json();
      onSelect(selected, data.session_id);
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(255,64,129,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.1) 0%, transparent 60%)",
      }}
    >
      {/* Decorative noise overlay */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", mb: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
          <BoltIcon sx={{ color: "#ff4081", fontSize: "2rem" }} />
          <GlitchText text="BIPOLAR CHATBOT" />
          <BoltIcon sx={{ color: "#00e5ff", fontSize: "2rem" }} />
        </Box>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Syne Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            mt: 1,
          }}
        >
          pick a personality. any personality.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 460,
          position: "relative",
          zIndex: 1,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Syne Mono', monospace",
              fontSize: "0.85rem",
            }}
          >
            Choose your bot persona
          </InputLabel>
          <Select
            value={selected}
            label="Choose your bot persona"
            onChange={(e) => setSelected(e.target.value)}
            sx={{
              fontFamily: "'Syne', sans-serif",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.15)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff4081",
              },
            }}
          >
            {Object.entries(PERSONA_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key} sx={{ fontFamily: "'Syne', sans-serif" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: PERSONA_COLORS[key]?.bg || "#ff4081",
                      boxShadow: `0 0 8px ${PERSONA_COLORS[key]?.bg || "#ff4081"}`,
                    }}
                  />
                  {label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selected && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <Chip
              label={PERSONA_LABELS[selected]}
              sx={{
                bgcolor: PERSONA_COLORS[selected]?.bg,
                color: PERSONA_COLORS[selected]?.text,
                fontFamily: "'Syne Mono', monospace",
                fontWeight: 700,
                fontSize: "0.85rem",
                px: 1,
                boxShadow: `0 0 20px ${PERSONA_COLORS[selected]?.bg}66`,
              }}
            />
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleStart}
          disabled={!selected || loading}
          sx={{
            py: 1.8,
            fontFamily: "'Syne Mono', monospace",
            fontWeight: 700,
            letterSpacing: "0.1em",
            fontSize: "1rem",
            background: selected
              ? `linear-gradient(135deg, ${PERSONA_COLORS[selected]?.bg || "#ff4081"}, #ff4081)`
              : "rgba(255,255,255,0.1)",
            color: selected ? PERSONA_COLORS[selected]?.text || "#fff" : "rgba(255,255,255,0.3)",
            borderRadius: 3,
            transition: "all 0.3s ease",
            boxShadow: selected ? `0 8px 30px ${PERSONA_COLORS[selected]?.bg || "#ff4081"}55` : "none",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: selected ? `0 12px 40px ${PERSONA_COLORS[selected]?.bg || "#ff4081"}77` : "none",
            },
            "&:disabled": {
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: "inherit" }} /> : "UNLEASH THE BOT →"}
        </Button>
      </Paper>
    </Box>
  );
}

function ChatInterface({ persona, sessionId, onReset }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const personaColor = PERSONA_COLORS[persona];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    // Add an empty assistant message we'll fill in as chunks arrive
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text, stream: true }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Update the last message (the assistant one) by appending each chunk
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚡ Something went haywire. Try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
    } catch (_) { }
    onReset();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          `radial-gradient(ellipse at 10% 10%, ${personaColor?.bg}22 0%, transparent 50%),` +
          "radial-gradient(ellipse at 90% 90%, rgba(255,64,129,0.1) 0%, transparent 50%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          background: "rgba(10,10,15,0.8)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <BoltIcon sx={{ color: personaColor?.bg || "#ff4081" }} />
          <Typography
            sx={{
              fontFamily: "'Syne Mono', monospace",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            BIPOLAR CHATBOT
          </Typography>
          <Chip
            label={PERSONA_LABELS[persona]}
            size="small"
            sx={{
              bgcolor: personaColor?.bg,
              color: personaColor?.text,
              fontFamily: "'Syne Mono', monospace",
              fontWeight: 700,
              fontSize: "0.7rem",
              boxShadow: `0 0 12px ${personaColor?.bg}88`,
            }}
          />
        </Box>

        <Tooltip title="Switch persona & clear session">
          <Button
            onClick={handleReset}
            startIcon={<AutorenewIcon />}
            size="small"
            sx={{
              fontFamily: "'Syne Mono', monospace",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                color: "#ff4081",
                borderColor: "#ff4081",
                background: "rgba(255,64,129,0.08)",
              },
            }}
          >
            SWITCH BOT
          </Button>
        </Tooltip>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, md: 4 },
          py: 3,
          display: "flex",
          flexDirection: "column",
          maxWidth: 860,
          width: "100%",
          mx: "auto",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: personaColor?.bg || "#ff4081",
            borderRadius: "4px",
          },
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.35,
              gap: 2,
              mt: 8,
            }}
          >
            <PsychologyAltIcon sx={{ fontSize: "4rem", color: personaColor?.bg }} />
            <Typography
              sx={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
              }}
            >
              {PERSONA_LABELS[persona]} is ready.
              <br />
              Say something.
            </Typography>
          </Box>
        )}

        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} personaColor={personaColor} />
        ))}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, ml: 6 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: personaColor?.bg || "#ff4081",
                  animation: "bounce 1.2s infinite",
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: `0 0 8px ${personaColor?.bg || "#ff4081"}`,
                  "@keyframes bounce": {
                    "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
                    "40%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              />
            ))}
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 2.5,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          background: "rgba(10,10,15,0.85)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            maxWidth: 860,
            mx: "auto",
            alignItems: "flex-end",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            inputRef={inputRef}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.95rem",
                borderRadius: 3,
                background: "rgba(255,255,255,0.04)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                "&.Mui-focused fieldset": {
                  borderColor: personaColor?.bg || "#ff4081",
                  boxShadow: `0 0 0 3px ${personaColor?.bg || "#ff4081"}22`,
                },
              },
            }}
          />
          <IconButton
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background:
                input.trim() && !loading
                  ? `linear-gradient(135deg, ${personaColor?.bg || "#ff4081"}, #ff4081)`
                  : "rgba(255,255,255,0.06)",
              color: input.trim() && !loading ? personaColor?.text || "#fff" : "rgba(255,255,255,0.2)",
              flexShrink: 0,
              transition: "all 0.2s ease",
              boxShadow:
                input.trim() && !loading ? `0 4px 20px ${personaColor?.bg || "#ff4081"}55` : "none",
              "&:hover": {
                transform: input.trim() && !loading ? "scale(1.08)" : "none",
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            mt: 1.5,
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'Syne Mono', monospace",
            letterSpacing: "0.1em",
          }}
        >
          ENTER to send · SHIFT+ENTER for new line
        </Typography>
      </Box>
    </Box>
  );
}

export default function App() {
  const [persona, setPersona] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleSelect = (selectedPersona, newSessionId) => {
    setPersona(selectedPersona);
    setSessionId(newSessionId);
  };

  const handleReset = () => {
    setPersona(null);
    setSessionId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&display=swap"
        rel="stylesheet"
      />
      {persona && sessionId ? (
        <ChatInterface persona={persona} sessionId={sessionId} onReset={handleReset} />
      ) : (
        <PersonaSelector onSelect={handleSelect} />
      )}
    </ThemeProvider>
  );
}