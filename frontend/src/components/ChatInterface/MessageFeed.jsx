import { useRef, useEffect } from "react";
import {
    Box,
    Typography,
} from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { PERSONA_LABELS, PERSONA_COLORS } from "../../constants/personas"
import Message from "./Message";

export default function MessageFeed({ messages, persona, loading }) {
    const personaColor = PERSONA_COLORS[persona];
    const personaLabel = PERSONA_LABELS[persona];

    const messagesEndRef = useRef(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
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
                        {personaLabel} is ready.
                        <br />
                        Say something.
                    </Typography>
                </Box>
            )}

            {messages.map((msg, i) => (
                <Message key={i} role={msg.role} content={msg.content} personaColor={personaColor} timestamp={msg.timestamp} />
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
    )
}