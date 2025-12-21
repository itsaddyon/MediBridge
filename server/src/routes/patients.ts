import express from 'express'
import prisma from '../lib/prisma'
import jwt from 'jsonwebtoken'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production'

type AuthRequest = express.Request & { userId?: number }

function authenticate(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'missing token' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid auth header' })

  try {
    const payload: any = jwt.verify(parts[1], JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch (err) {
    res.status(401).json({ error: 'invalid token' })
  }
}

router.use(authenticate)

router.get('/', async (req: AuthRequest, res) => {
  const userId = req.userId!
  const patients = await prisma.patient.findMany({ where: { createdById: userId } })
  res.json(patients)
})

router.post('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!
    const { firstName, lastName, dob, phone, notes } = req.body
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dob: dob ? new Date(dob) : undefined,
        phone,
        notes,
        createdBy: { connect: { id: userId } }
      }
    })
    res.status(201).json(patient)
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/:id', async (req: AuthRequest, res) => {
  const userId = req.userId!
  const id = Number(req.params.id)
  const patient = await prisma.patient.findUnique({ where: { id } })
  if (!patient || patient.createdById !== userId) return res.status(404).json({ error: 'not found' })
  res.json(patient)
})

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!
    const id = Number(req.params.id)
    const existing = await prisma.patient.findUnique({ where: { id } })
    if (!existing || existing.createdById !== userId) return res.status(404).json({ error: 'not found' })

    const { firstName, lastName, dob, phone, notes } = req.body
    const updated = await prisma.patient.update({
      where: { id },
      data: { firstName, lastName, dob: dob ? new Date(dob) : undefined, phone, notes }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!
    const id = Number(req.params.id)
    const existing = await prisma.patient.findUnique({ where: { id } })
    if (!existing || existing.createdById !== userId) return res.status(404).json({ error: 'not found' })
    await prisma.patient.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

export default router
