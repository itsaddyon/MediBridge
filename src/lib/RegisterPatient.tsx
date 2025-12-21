import { useState } from "react";
import { registerPatient } from "@/lib/patientService";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await registerPatient({
      name: formData.name,
      email: formData.email,
      age: formData.age,
      gender: formData.gender,
    });

    alert("Patient registered successfully 🩺");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="age" placeholder="Age" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <button type="submit">Register Patient</button>
    </form>
  );
};

export default RegisterPatient;
