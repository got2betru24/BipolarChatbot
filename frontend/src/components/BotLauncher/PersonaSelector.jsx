import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    CircularProgress,
} from "@mui/material";
import { PERSONA_LABELS, PERSONA_COLORS } from "../../constants/personas"
import { createSession } from "../../api/sessions"
import PersonaChip from "../PersonaChip";

export default function PersonaSelector({ onSelect }) {
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            const data = await createSession({ persona: selected })
            onSelect(selected, data.session_id);
        } catch (err) {
            console.error("Failed to create session:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ff4081" },
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
                    <PersonaChip persona={selected} />
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
                    color: selected
                        ? PERSONA_COLORS[selected]?.text || "#fff"
                        : "rgba(255,255,255,0.3)",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    boxShadow: selected
                        ? `0 8px 30px ${PERSONA_COLORS[selected]?.bg || "#ff4081"}55`
                        : "none",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: selected
                            ? `0 12px 40px ${PERSONA_COLORS[selected]?.bg || "#ff4081"}77`
                            : "none",
                    },
                    "&:disabled": { background: "rgba(255,255,255,0.05)" },
                }}
            >
                {loading ? (
                    <CircularProgress size={22} sx={{ color: "inherit" }} />
                ) : (
                    "UNLEASH THE BOT →"
                )}
            </Button>
        </>
    );
}