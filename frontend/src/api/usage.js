export async function fetchUsage(sessionId) {
    const res = await fetch(`/api/sessions/${sessionId}/usage`);
    return res.json();
}
