import {
    Box,
    Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import GlitchText from "./GlitchText"

export default function PersonaHeader() {
    return (
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
    )
}