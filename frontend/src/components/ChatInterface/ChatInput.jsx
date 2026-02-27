import { useState, useRef, useEffect } from "react";
import {
    Box,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput({ color, loading, onSend }) {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (!loading) {
            inputRef.current?.focus();
        }
    }, [loading]);

    const handleSend = () => {
        const text = input.trim();
        if (!text || loading) return;
        onSend(text);   // passes text up to ChatInterface
        setInput("");   // clears its own state
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
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
                    placeholder="Type your message..."
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
                                borderColor: color?.bg || "#ff4081",
                                boxShadow: `0 0 0 3px ${color?.bg || "#ff4081"}22`,
                            },
                        },
                    }}
                />
                <IconButton
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        background:
                            input.trim() && !loading
                                ? `linear-gradient(135deg, ${color?.bg || "#ff4081"}, #ff4081)`
                                : "rgba(255,255,255,0.06)",
                        color: input.trim() && !loading ? color?.text || "#fff" : "rgba(255,255,255,0.2)",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                        boxShadow:
                            input.trim() && !loading ? `0 4px 20px ${color?.bg || "#ff4081"}55` : "none",
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
    )
}