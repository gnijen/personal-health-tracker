import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function AddLabPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    test_name: "",
    value: "",
    test_date: "",
    reference_low: "",
    reference_high: "",
    doctor_notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiRequest("/labs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          reference_low: Number(form.reference_low),
          reference_high: Number(form.reference_high),
        }),
      });
      navigate("/labs");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Link to="/labs">Back</Link>
      <h1>Add a lab result</h1>
      <p>You'll find these numbers on your lab report.</p>

      <label htmlFor="test_name">Test name</label>
      <input id="test_name" name="test_name" value={form.test_name} onChange={handleChange} placeholder="For example, HbA1c" required />

      <label htmlFor="value">Your result</label>
      <input id="value" name="value" type="number" step="any" value={form.value} onChange={handleChange} required />

      <label htmlFor="test_date">Test date</label>
      <input id="test_date" name="test_date" type="date" value={form.test_date} onChange={handleChange} required />

      <label htmlFor="reference_low">Usual range: lowest</label>
      <input id="reference_low" name="reference_low" type="number" step="any" value={form.reference_low} onChange={handleChange} required />

      <label htmlFor="reference_high">Usual range: highest</label>
      <input id="reference_high" name="reference_high" type="number" step="any" value={form.reference_high} onChange={handleChange} required />

      <label htmlFor="doctor_notes">Note from your doctor (optional)</label>
      <input id="doctor_notes" name="doctor_notes" value={form.doctor_notes} onChange={handleChange} />

      {error && <p>{error}</p>}
      <button type="submit">Save result</button>
    </form>
  );
}