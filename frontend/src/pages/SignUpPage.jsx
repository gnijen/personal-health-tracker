import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            await apiRequest("/signup", {
                method: "POST",
                body: JSON.stringify({ first_name: firstName, email, password }),
            });
            const data = await apiRequest("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("first_name", data.first_name || "");
            navigate("/home");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <form className="card auth" onSubmit={handleSubmit}>
            <h1>Create your account</h1>
            <p className="muted">It only takes a minute. Your information stays private to you.</p>

            <label htmlFor="first_name">First name</label>
            <input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="muted">At least 8 characters.</p>

            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={busy}>{busy ? "Creating your account..." : "Create account"}</button>

            {busy && (
                <p className="muted waking" role="status">
                    Waking up the server. The first sign-up can take up to a minute.
                </p>
            )}

            <p className="muted">Already have an account? <Link to="/">Sign in</Link></p>
        </form>
    );
}