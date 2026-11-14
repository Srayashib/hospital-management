import { useState } from "react";

const PrescriptionForm = () => {

  const [form, setForm] = useState({
    patient: "",
    medicine: "",
    dosage: "",
    advice: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log(form);

  };

  return (
    <div className="prescription-form">

      <h3>Create Prescription</h3>

      <form onSubmit={handleSubmit}>

        <input
          name="patient"
          placeholder="Patient Name"
          onChange={handleChange}
        />

        <input
          name="medicine"
          placeholder="Medicine"
          onChange={handleChange}
        />

        <input
          name="dosage"
          placeholder="Dosage"
          onChange={handleChange}
        />

        <textarea
          rows="4"
          name="advice"
          placeholder="Advice"
          onChange={handleChange}
        />

        <button type="submit">
          Save Prescription
        </button>

      </form>

    </div>
  );
};

export default PrescriptionForm;