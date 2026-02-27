import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import { TEMPERATURE_MODES } from "../../constants/temperature"
import { createSession } from "../../api/sessions"

export default function CustomPersona({ onSelect }) {
    const [showCustom, setShowCustom] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [customTemp, setCustomTemp] = useState(0.5);
    const [customLoading, setCustomLoading] = useState(false);

    const handleCustomStart = async () => {
        if (!customPrompt.trim()) return;
        setCustomLoading(true);
        try {
            const data = await createSession({
                model: "claude-haiku-4-5",
                max_tokens: 1000,
                system_prompt: customPrompt,
                temperature: customTemp,
            });
            onSelect("custom", data.session_id);
        } catch (err) {
            console.error("Failed to create custom session:", err);
        } finally {
            setCustomLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    size="small"
                    onClick={() => setShowCustom((v) => !v)}
                    sx={{
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        color: "rgba(255,255,255,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 2,
                        px: 2,
                        py: 0.6,
                        textTransform: "uppercase",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            color: "rgba(255,255,255,0.6)",
                            borderColor: "rgba(255,255,255,0.2)",
                            background: "rgba(255,255,255,0.04)",
                        },
                    }}
                >
                    {showCustom ? "▲ hide custom bot" : "✦ build your own bot"}
                </Button>
            </Box>
            {showCustom && (
                <Box
                    sx={{
                        mt: 3,
                        p: 2.5,
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Describe your bot's personality and purpose..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                fontFamily: "'Syne', sans-serif",
                                fontSize: "0.85rem",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.35)" },
                            },
                        }}
                    />

                    <FormControl fullWidth sx={{ mb: 2.5 }}>
                        <InputLabel
                            sx={{
                                color: "rgba(255,255,255,0.4)",
                                fontFamily: "'Syne Mono', monospace",
                                fontSize: "0.8rem",
                            }}
                        >
                            Response style
                        </InputLabel>
                        <Select
                            value={customTemp}
                            label="Response style"
                            onChange={(e) => setCustomTemp(e.target.value)}
                            sx={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: "0.85rem",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "rgba(255,255,255,0.35)",
                                },
                            }}
                        >
                            {TEMPERATURE_MODES.map((mode) => (
                                <MenuItem key={mode.value} value={mode.value}>
                                    <Box>
                                        <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: "0.9rem" }}>
                                            {mode.label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Syne Mono', monospace",
                                                fontSize: "0.7rem",
                                                color: "rgba(255,255,255,0.4)",
                                            }}
                                        >
                                            {mode.description}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={handleCustomStart}
                        disabled={!customPrompt.trim() || customLoading}
                        sx={{
                            py: 1,
                            fontFamily: "'Syne Mono', monospace",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.1em",
                            borderColor: "rgba(255,255,255,0.2)",
                            color: customPrompt.trim() ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                            borderRadius: 2,
                            "&:hover": {
                                borderColor: "rgba(255,255,255,0.4)",
                                background: "rgba(255,255,255,0.05)",
                            },
                            "&:disabled": {
                                borderColor: "rgba(255,255,255,0.07)",
                                color: "rgba(255,255,255,0.15)",
                            },
                        }}
                    >
                        {customLoading ? (
                            <CircularProgress size={16} sx={{ color: "inherit" }} />
                        ) : (
                            "LAUNCH CUSTOM BOT →"
                        )}
                    </Button>
                </Box>
            )}

        </>
    );
}