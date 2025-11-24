import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  symptoms: { type: String },
  doctorId: { type: String },
  clinicId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;