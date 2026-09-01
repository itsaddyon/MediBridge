"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const patientSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    symptoms: { type: String },
    doctorId: { type: String },
    clinicId: { type: String },
    createdAt: { type: Date, default: Date.now },
});
const Patient = mongoose_1.default.model('Patient', patientSchema);
exports.default = Patient;
