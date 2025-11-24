import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import patientRoutes from './routes/patients'
import mongoose from 'mongoose';

dotenv.config()
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medibridge')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`)
})
