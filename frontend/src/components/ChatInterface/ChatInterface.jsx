import { useState, useEffect } from "react";
import {
    Box,
} from "@mui/material";
import { PERSONA_COLORS, PERSONA_WELCOME_MESSAGES } from "../../constants/personas"
import { deleteSession } from "../../api/sessions"
import { fetchUsage as fetchUsageFromApi } from "../../api/usage";
import { sendMessage as sendMessageApi } from "../../api/chat";
import ChatHeader from "./ChatHeader";
import UsageStatBar from "./UsageStatBar";
import UsageSummaryModal from "./UsageSummaryModal";
import MessageFeed from "./MessageFeed";
import ChatInput from "./ChatInput";

export default function ChatInterface({ persona, sessionId, onReset }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: PERSONA_WELCOME_MESSAGES[persona] ?? "Hello! How can I help you?",
            timestamp: new Date(),
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [usage, setUsage] = useState({ input_tokens: 0, output_tokens: 0, total_cost: 0 });
    const [showSummary, setShowSummary] = useState(false);
    const personaColor = PERSONA_COLORS[persona];

    const sendMessage = async (text) => {
        if (!text || loading) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: text, timestamp: new Date() },
        ]);
        setLoading(true);

        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "", timestamp: new Date() },
        ]);

        try {
            await sendMessageApi(sessionId, text, (chunk) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: updated[updated.length - 1].content + chunk,
                        timestamp: updated[updated.length - 1].timestamp,
                    };
                    return updated;
                });
            });
        } catch (err) {
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: "⚡ Something went haywire. Try again.",
                };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUsage = async () => {
        try {
            const data = await fetchUsageFromApi(sessionId)
            setUsage(data.usage);
        } catch (err) { } // Usage tracking is non-critical, fail silently
    };

    // Fetch usage after each completed message
    useEffect(() => {
        if (!loading && messages.length > 0) fetchUsage();
    }, [loading]);

    const handleReset = async () => {
        await fetchUsage();
        setShowSummary(true);
    };

    const handleConfirm = async () => {
        setShowSummary(false);
        try {
            await deleteSession(sessionId);
        } catch (err) { } // Session may already be gone, proceed with reset regardless.
        onReset();
    }

    return (
        <Box
            sx={{
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                background:
                    `radial-gradient(ellipse at 10% 10%, ${personaColor?.bg}22 0%, transparent 50%),` +
                    "radial-gradient(ellipse at 90% 90%, rgba(255,64,129,0.1) 0%, transparent 50%)",
            }}
        >
            <ChatHeader persona={persona} onReset={handleReset} />
            <MessageFeed messages={messages} persona={persona} loading={loading} />
            <UsageStatBar usage={usage} />
            <ChatInput color={personaColor} loading={loading} onSend={sendMessage} />
            <UsageSummaryModal
                open={showSummary}
                usage={usage}
                persona={persona}
                onConfirm={handleConfirm}
            />
        </Box>
    );
}