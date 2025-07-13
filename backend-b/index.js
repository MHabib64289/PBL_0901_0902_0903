import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import fetch from 'node-fetch'
import Book from './models/Book.js'

const app = express()
const PORT = 3002
const MONGODB_URI = 'mongodb://127.0.0.1:27017/dbA'

app.use(cors())
app.use(express.json())

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Backend B: Terhubung ke MongoDB dbA'))
  .catch(err => console.error('Gagal konek ke MongoDB:', err))

// Fungsi kirim log ke backend-c
const logActivity = async (action, target, description) => {
  try {
    await fetch('http://localhost:3003/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, target, description })
    })
  } catch (err) {
    console.error('Gagal kirim log ke Backend C:', err.message)
  }
}

// UPDATE buku
app.put('/books/:id', async (req, res) => {
  try {
    const before = await Book.findById(req.params.id)
    if (!before) return res.status(404).json({ error: 'Buku tidak ditemukan' })

    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })

    const changes = []
    if (req.body.title && req.body.title !== before.title)
      changes.push(`judul dari "${before.title}" menjadi "${req.body.title}"`)
    if (req.body.author && req.body.author !== before.author)
      changes.push(`penulis dari "${before.author}" menjadi "${req.body.author}"`)
    if (req.body.year && req.body.year !== before.year)
      changes.push(`tahun dari "${before.year}" menjadi "${req.body.year}"`)

    const desc = changes.length > 0
      ? `Mengubah buku "${before.title}" (${before.author}): ${changes.join(', ')}`
      : `Mengedit buku tanpa perubahan data signifikan.`

    await logActivity('update', 'Book', desc)

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE buku
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' })

    await logActivity('delete', 'Book', `Menghapus buku: "${book.title}" oleh ${book.author}`)
    res.json({ message: 'Buku berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend B berjalan di http://localhost:${PORT}`)
})
