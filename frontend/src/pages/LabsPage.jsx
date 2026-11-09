import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

export default function LabsPage() {
    const [labs, setLabs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLabs = async () => {
            try {
                const data = await apiRequest("/labs");
                setLabs(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadLabs();
    }, []);

        return (
        <div>
            <Link to="/home">← Home</Link>
            <div className="page-header">
                <h1>Lab results</h1>
                <Link to="/labs/new" className="link-button">Add a result</Link>
            </div>
            {error && <p className="error">{error}</p>}
            {labs.length === 0 && !error && <p className="muted">No lab results yet.</p>}
            <div className="grid">
                {labs.map((lab) => (
                    <div className="card" key={lab.lab_id}>
                        <h2>{lab.test_name}</h2>
                        <p className="muted">Tested {lab.test_date}</p>
                        <p>Result: {lab.value}</p>
                        <p>Usual range: {lab.reference_low} to {lab.reference_high}</p>
                        <span className={lab.in_range ? "badge ok" : "badge warn"}>
                            {lab.in_range ? "In range" : "A little outside the usual range"}
                        </span>
                        {lab.doctor_notes && <p>Note from your doctor: {lab.doctor_notes}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}