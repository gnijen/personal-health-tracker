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
      <Link to="/home">Back to home</Link>
      <h1>Lab results</h1>
      <Link to="/labs/new">Add a result</Link>
      {error && <p>{error}</p>}
      {labs.length === 0 && !error && <p>No lab results yet.</p>}
      {labs.map((lab) => (
        <div key={lab.lab_id}>
          <h2>{lab.test_name}</h2>
          <p>Tested {lab.test_date}</p>
          <p>Result: {lab.value}</p>
          <p>Usual range: {lab.reference_low} to {lab.reference_high}</p>
          <p>{lab.in_range ? "In range" : "Outside the usual range"}</p>
          {lab.doctor_notes && <p>Note from your doctor: {lab.doctor_notes}</p>}
        </div>
      ))}
    </div>
  );
}