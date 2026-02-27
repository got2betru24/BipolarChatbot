import {
    Box,
    Typography,
    Paper,
    Avatar,
} from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

export default function Message({ role, content, personaColor, timestamp }) {
    const isUser = role === "user";
    const timeString = timestamp
        ? timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 2,
                gap: 1,
                alignItems: "flex-end",
                // Reveal timestamp on hover via CSS
                "&:hover .msg-timestamp": { opacity: 1 },
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

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 0.4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        maxWidth: "100%",
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

                {/* Timestamp — hidden until parent hover */}
                <Typography
                    className="msg-timestamp"
                    sx={{
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: "0.62rem",
                        color: "rgba(255,255,255,0.2)",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        px: 0.5,
                    }}
                >
                    {timeString}
                </Typography>
            </Box>

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