import {
    Box,
    Button,
    Typography,
    Tooltip,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BoltIcon from "@mui/icons-material/Bolt";
import { PERSONA_COLORS } from "../../constants/personas"
import PersonaChip from "../PersonaChip";

export default function ChatHeader({ persona, onReset }) {
    const personaColor = PERSONA_COLORS[persona];
    return (
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
                <PersonaChip persona={persona} size="small" />
            </Box>

            <Tooltip title="Switch persona & clear session">
                <Button
                    onClick={onReset}
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
    )
}