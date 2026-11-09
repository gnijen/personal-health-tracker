import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function HomePage() {
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

  return (
    <div>
      <h1>Good afternoon</h1>
      {error && <p>{error}</p>}
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