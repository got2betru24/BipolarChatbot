export async function createSession(payload) {
    const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function deleteSession(sessionId) {
    const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
    });
    return res.json();
}

export async function resetSession(sessionId) {
    const res = await fetch(`/api/sessions/${sessionId}/reset`, {
        method: "DELETE",
    });
    return res.json();
}