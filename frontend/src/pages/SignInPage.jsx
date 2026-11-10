import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    const finishSignIn = (data) => {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("first_name", data.first_name || "");
        navigate("/home");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const data = await apiRequest("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            finishSignIn(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDemo = async () => {
        setError("");
        setBusy(true);
        try {
            const data = await apiRequest("/demo", { method: "POST" });
            finishSignIn(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <form className="card auth" onSubmit={handleSubmit}>
            <h1>Welcome home</h1>
            <p className="muted">Your medicines, refills and lab results, looked after in one place.</p>

            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>

            <p className="or">or</p>
            <button type="button" className="demo-button" onClick={handleDemo} disabled={busy}>
                Try the demo, no sign-up needed
            </button>

            {busy && (
                <p className="muted waking" role="status">
                    Waking up the server. The first sign-in can take up to a minute.
                </p>
            )}

            <p className="muted">New here? <Link to="/signup">Create an account</Link></p>
        </form>
    );
}