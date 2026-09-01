"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';
function authenticate(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ error: 'missing token' });
    const parts = auth.split(' ');
    if (parts.length !== 2)
        return res.status(401).json({ error: 'invalid auth header' });
    try {
        const payload = jsonwebtoken_1.default.verify(parts[1], JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'invalid token' });
    }
}
router.use(authenticate);
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const patients = yield prisma_1.default.patient.findMany({ where: { createdById: userId } });
    res.json(patients);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { firstName, lastName, dob, phone, notes } = req.body;
        const patient = yield prisma_1.default.patient.create({
            data: {
                firstName,
                lastName,
                dob: dob ? new Date(dob) : undefined,
                phone,
                notes,
                createdBy: { connect: { id: userId } }
            }
        });
        res.status(201).json(patient);
    }
    catch (err) {
        res.status(500).json({ error: 'server error' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const id = Number(req.params.id);
    const patient = yield prisma_1.default.patient.findUnique({ where: { id } });
    if (!patient || patient.createdById !== userId)
        return res.status(404).json({ error: 'not found' });
    res.json(patient);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const id = Number(req.params.id);
        const existing = yield prisma_1.default.patient.findUnique({ where: { id } });
        if (!existing || existing.createdById !== userId)
            return res.status(404).json({ error: 'not found' });
        const { firstName, lastName, dob, phone, notes } = req.body;
        const updated = yield prisma_1.default.patient.update({
            where: { id },
            data: { firstName, lastName, dob: dob ? new Date(dob) : undefined, phone, notes }
        });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: 'server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const id = Number(req.params.id);
        const existing = yield prisma_1.default.patient.findUnique({ where: { id } });
        if (!existing || existing.createdById !== userId)
            return res.status(404).json({ error: 'not found' });
        yield prisma_1.default.patient.delete({ where: { id } });
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: 'server error' });
    }
}));
exports.default = router;
