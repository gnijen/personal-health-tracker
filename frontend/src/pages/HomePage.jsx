import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function HomePage() {
    const [meds, setMeds] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("first_name");
        navigate("/");
    };

    useEffect(() => {
        const loadMeds = async () => {
            try {
                const [medsData, alertsData] = await Promise.all([
                    apiRequest("/medications"),
                    apiRequest("/medications/alerts"),
                ]);
                setMeds(medsData);
                setAlerts(alertsData);
            } catch (err) {
                setError(err.message);
            }
        };
        loadMeds();
    }, []);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const firstName = localStorage.getItem("first_name");
    return (
        <div>
            <div className="nav">
                <Link to="/medicines">Medicines</Link>
                <Link to="/labs">Lab results</Link>
                <button className="secondary" onClick={handleSignOut}>Sign out</button>
            </div>
            <h1>{greeting}{firstName ? `, ${firstName}` : ""}</h1>
            {error && <p className="error">{error}</p>}

            {!error && (
                <div className="home-columns">
                    <section>
                        <h2>Needs your attention</h2>
                        {alerts.length === 0 ? (
                            <p className="card">You're all caught up. Nothing needs doing today.</p>
                        ) : (
                            alerts.map((m) => (
                                <div className="card attention" key={m.medication_id}>
                                    <strong>{m.medication_name}</strong>
                                    <p>{m.alert_message}</p>
                                </div>
                            ))
                        )}
                    </section>
                    <section>
                        <h2>Your medicines</h2>
                        <div className="card">
                            {meds.length === 0 ? (
                                <p className="muted">No medicines yet.</p>
                            ) : (
                                <ul>
                                    {meds.map((m) => (
                                        <li key={m.medication_id}>{m.medication_name} ({m.dosage})</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}