import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function AddMedicinePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    medication_name: "",
    dosage: "",
    instructions: "",
    last_refill_date: "",
    days_per_supply: "",
    refills_remaining: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiRequest("/medications", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          days_per_supply: Number(form.days_per_supply),
          refills_remaining: Number(form.refills_remaining),
        }),
      });
      navigate("/medicines");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Link to="/medicines">Back</Link>
      <h1>Add a medicine</h1>
      <p>You'll find most of this on the pharmacy label.</p>

      <label htmlFor="medication_name">Medicine name</label>
      <input id="medication_name" name="medication_name" value={form.medication_name} onChange={handleChange} required />

      <label htmlFor="dosage">Dose</label>
      <input id="dosage" name="dosage" value={form.dosage} onChange={handleChange} placeholder="For example, 500mg" required />

      <label htmlFor="instructions">How to take it</label>
      <input id="instructions" name="instructions" value={form.instructions} onChange={handleChange} placeholder="For example, twice daily with meals" required />

      <label htmlFor="last_refill_date">Date of last refill</label>
      <input id="last_refill_date" name="last_refill_date" type="date" value={form.last_refill_date} onChange={handleChange} required />

      <label htmlFor="days_per_supply">Days it lasts</label>
      <input id="days_per_supply" name="days_per_supply" type="number" min="1" value={form.days_per_supply} onChange={handleChange} required />

      <label htmlFor="refills_remaining">Refills left</label>
      <input id="refills_remaining" name="refills_remaining" type="number" min="0" value={form.refills_remaining} onChange={handleChange} required />

      {error && <p>{error}</p>}
      <button type="submit">Save medicine</button>
    </form>
  );
}