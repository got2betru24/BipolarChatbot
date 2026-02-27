import {
    Chip,
} from "@mui/material";
import { PERSONA_LABELS, PERSONA_COLORS } from "../constants/personas"

export default function PersonaChip({ persona, size = 'medium' }) {
    const label = PERSONA_LABELS[persona];
    const color = PERSONA_COLORS[persona];

    return (

        <Chip
            label={label}
            size={size === "small" ? "small" : undefined}
            sx={{
                bgcolor: color?.bg,
                color: color?.text,
                fontFamily: "'Syne Mono', monospace",
                fontWeight: 700,
                fontSize: size === "small" ? "0.7rem" : "0.85rem",
                px: size === "small" ? 0 : 1,
                boxShadow: `0 0 ${size === "small" ? "12px" : "20px"} ${color?.bg}${size === "small" ? "88" : "66"}`,
            }}
        />

    )
}