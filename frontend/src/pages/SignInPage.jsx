import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { apiRequest } from "../api";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await apiRequest("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("first_name", data.first_name || "");
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <form className="card auth" onSubmit={handleSubmit}>
            <h1>Welcome home</h1>
            <p className="muted">Your medicines, refills and lab results, looked after in one place.</p>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />


            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Sign in</button>
            <p className="muted">New here? <Link to="/signup">Create an account</Link></p>

        </form>
    );
}