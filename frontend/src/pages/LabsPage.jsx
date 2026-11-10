import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

function markerPosition(lab) {
    const span = lab.reference_high - lab.reference_low;
    const start = lab.reference_low - span / 2;
    const position = ((lab.value - start) / (span * 2)) * 100;
    return Math.min(Math.max(position, 3), 97);
}

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
                        <div
                            className="range"
                            role="img"
                            aria-label={`Your result ${lab.value}, usual range ${lab.reference_low} to ${lab.reference_high}`}
                        >
                            <div className="range-band" />
                            <div
                                className={lab.in_range ? "range-marker" : "range-marker warn"}
                                style={{ left: `${markerPosition(lab)}%` }}
                            />
                        </div>
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