import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production'

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hashed, name } })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

export default router
