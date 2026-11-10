const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
        throw new Error("Can't reach the server. Please try again.");
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // The server sent something that isn't JSON, e.g. an error page while it wakes up
    }
    if (!response.ok) {
        const message = typeof data?.detail === "string" ? data.detail : "Something went wrong. Please try again.";
        throw new Error(message);
    }
    return data;
}