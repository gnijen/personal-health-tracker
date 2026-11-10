import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [meds, setMeds] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [labs, setLabs] = useState([]);
    const [error, setError] = useState("");


    useEffect(() => {
        const loadMeds = async () => {
            try {
                const [medsData, alertsData, labsData] = await Promise.all([
                    apiRequest("/medications"),
                    apiRequest("/medications/alerts"),
                    apiRequest("/labs"),
                ]);
                setMeds(medsData);
                setAlerts(alertsData);
                setLabs(labsData);
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
            <h1>{greeting}{firstName ? `, ${firstName}` : ""}</h1>
            {error && <p className="error">{error}</p>}
            {!error && (
                <div className="stats">
                    <Link to="/medicines" className="stat">
                        <span className="stat-number">{meds.length}</span>
                        <span className="stat-label">Medicines</span>
                    </Link>
                    <div className={alerts.length > 0 ? "stat attention" : "stat"}>
                        <span className="stat-number">{alerts.length}</span>
                        <span className="stat-label">Need attention</span>
                    </div>
                    <Link to="/labs" className="stat">
                        <span className="stat-number">{labs.length}</span>
                        <span className="stat-label">Lab results</span>
                    </Link>
                </div>
            )}

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