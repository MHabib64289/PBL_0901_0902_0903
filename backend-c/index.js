import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Log from './models/Log.js'

const app = express()
const PORT = 3003
const MONGODB_URI = 'mongodb://127.0.0.1:27017/dbB'

app.use(cors())
app.use(express.json())

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Backend C: Terhubung ke MongoDB dbB'))
  .catch(err => console.error('Gagal konek ke MongoDB:', err))

// Endpoint untuk menyimpan log aktivitas
app.post('/logs', async (req, res) => {
  try {
    const { action, target, description } = req.body
    const log = new Log({ action, target, description })
    await log.save()
    res.status(201).json(log)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Endpoint untuk menampilkan seluruh log
app.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }) // log terbaru duluan
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend C berjalan di http://localhost:${PORT}`)
})
