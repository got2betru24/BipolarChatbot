import {
    Box,
    Button,
    Typography,
    Paper,
} from "@mui/material";
import { PERSONA_LABELS, PERSONA_COLORS } from "../../constants/personas"


export default function UsageSummaryModal({ open, usage, persona, onConfirm }) {
    const personaColor = PERSONA_COLORS[persona];

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: open ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 380,
                    mx: 3,
                    background: "rgba(18,18,28,0.98)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.3em",
                        color: "rgba(255,255,255,0.3)",
                        mb: 1,
                        textTransform: "uppercase",
                    }}
                >
                    Session Complete
                </Typography>

                <Typography
                    sx={{
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "#fff",
                        mb: 0.5,
                    }}
                >
                    {PERSONA_LABELS[persona]}
                </Typography>

                <Box
                    sx={{
                        mt: 3,
                        mb: 3,
                        p: 2.5,
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    {[
                        { label: "Input tokens", value: usage.input_tokens?.toLocaleString() },
                        { label: "Output tokens", value: usage.output_tokens?.toLocaleString() },
                        { label: "Input cost", value: `$${usage.input_cost?.toFixed(4) ?? "0.0000"}` },
                        { label: "Output cost", value: `$${usage.output_cost?.toFixed(4) ?? "0.0000"}` },
                    ].map(({ label, value }) => (
                        <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
                                sx={{
                                    fontFamily: "'Syne Mono', monospace",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.4)",
                                }}
                            >
                                {label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Syne Mono', monospace",
                                    fontSize: "0.85rem",
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                {value}
                            </Typography>
                        </Box>
                    ))}

                    <Box
                        sx={{
                            pt: 1.5,
                            mt: 0.5,
                            borderTop: "1px solid rgba(255,255,255,0.07)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "'Syne Mono', monospace",
                                fontSize: "0.8rem",
                                color: "rgba(255,255,255,0.6)",
                                fontWeight: 700,
                            }}
                        >
                            Total cost
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Syne Mono', monospace",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: personaColor?.bg || "#ff4081",
                                textShadow: `0 0 20px ${personaColor?.bg || "#ff4081"}88`,
                            }}
                        >
                            ${usage.total_cost?.toFixed(4) ?? "0.0000"}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    fullWidth
                    onClick={onConfirm}
                    sx={{
                        py: 1.5,
                        fontFamily: "'Syne Mono', monospace",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        letterSpacing: "0.1em",
                        background: `linear-gradient(135deg, ${personaColor?.bg || "#ff4081"}, #ff4081)`,
                        color: personaColor?.text || "#fff",
                        borderRadius: 3,
                        boxShadow: `0 8px 30px ${personaColor?.bg || "#ff4081"}44`,
                        "&:hover": { transform: "translateY(-2px)" },
                    }}
                >
                    SWITCH BOT →
                </Button>
            </Paper>
        </Box>
    );
}