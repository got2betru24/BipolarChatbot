import {
    Box,
    Typography,
} from "@mui/material";

export default function UsageStatBar({ usage }) {


    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 0.75,
                display: "flex",
                justifyContent: "center",
                gap: 3,
                borderTop: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(10,10,15,0.6)",
            }}
        >
            {[
                { label: "in", value: usage.input_tokens?.toLocaleString() ?? "0" },
                { label: "out", value: usage.output_tokens?.toLocaleString() ?? "0" },
                { label: "cost", value: `$${usage.total_cost?.toFixed(4) ?? "0.0000"}` },
            ].map(({ label, value }) => (
                <Box key={label} sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                    <Typography
                        sx={{
                            fontFamily: "'Syne Mono', monospace",
                            fontSize: "0.65rem",
                            color: "rgba(255,255,255,0.2)",
                            letterSpacing: "0.1em",
                        }}
                    >
                        {label}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Syne Mono', monospace",
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.45)",
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}