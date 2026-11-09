import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

export default function MedicinesPage() {
    const [meds, setMeds] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMeds = async () => {
            try {
                const data = await apiRequest("/medications");
                setMeds(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadMeds();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove ${name} from your medicines?`)) {
            return;
        }
        try {
            await apiRequest(`/medications/${id}`, { method: "DELETE" });
            setMeds(meds.filter((m) => m.medication_id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <Link to="/home">← Home</Link>
            <div className="page-header">
                <h1>Your medicines</h1>
                <Link to="/medicines/new" className="link-button">Add a medicine</Link>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="grid">
                {meds.map((m) => (
                    <div className="card" key={m.medication_id}>
                        <h2>{m.medication_name}</h2>
                        <p className="muted">{m.dosage} · {m.instructions}</p>
                        <p>Refills left: {m.refills_remaining}</p>
                        <p>Refill reminder: {m.alert_date}</p>
                        <button className="secondary" onClick={() => handleDelete(m.medication_id, m.medication_name)}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}