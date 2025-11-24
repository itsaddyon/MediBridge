import { useState } from 'react';

function PatientForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // assuming JWT is stored here

    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    console.log('✅ Patient created:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <input name="dob" type="date" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="notes" placeholder="Notes" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PatientForm;