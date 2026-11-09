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

    return (
        <div>
            <h1>Good afternoon</h1>
            <button onClick={handleSignOut}>Sign out</button>
            <Link to="/medicines">See all medicines</Link>
            <Link to="/labs">See lab results</Link>
            {error && <p>{error}</p>}
            <h2>Needs your attention</h2>
            {alerts.length === 0 ? (
                <p>You're all caught up. Nothing needs doing today.</p>
            ) : (
                alerts.map((m) => (
                    <div key={m.medication_id}>
                        <strong>{m.medication_name}</strong>
                        <p>{m.alert_message}</p>
                    </div>
                ))
            )}
            <h2>Your medicines</h2>
            <ul>
                {meds.map((m) => (
                    <li key={m.medication_id}>
                        {m.medication_name} ({m.dosage})
                    </li>
                ))}
            </ul>
        </div>
    );
}