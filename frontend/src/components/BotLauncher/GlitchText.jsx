import {
    Box,
    Typography,
} from "@mui/material";

export default function GlitchText({ text }) {
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