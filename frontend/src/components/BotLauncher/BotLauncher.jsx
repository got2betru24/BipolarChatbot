import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import PersonaSelector from "./PersonaSelector";
import PersonaHeader from "./PersonaHeader";
import CustomPersona from "./CustomPersona";

export default function BotLauncher({ onSelect }) {

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
            <PersonaHeader />
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
                <PersonaSelector onSelect={onSelect} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                    <Box sx={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                    <Typography
                        sx={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.2)",
                            fontFamily: "'Syne Mono', monospace",
                            letterSpacing: "0.2em",
                        }}
                    >
                        OR
                    </Typography>
                    <Box sx={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                </Box>
                <CustomPersona onSelect={onSelect} />
            </Paper>
        </Box>
    );
}