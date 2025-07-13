import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import fetch from 'node-fetch' // pastikan sudah install: npm i node-fetch
import Book from './models/Book.js'

const app = express()
const PORT = 3001
const MONGODB_URI = 'mongodb://127.0.0.1:27017/dbA'

app.use(cors())
app.use(express.json())

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Backend A: Terhubung ke MongoDB dbA'))
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err))

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

// CREATE buku
app.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body)
    const saved = await newBook.save()

    await logActivity('create', 'Book', `Menambahkan buku: "${saved.title}" oleh ${saved.author}`)
    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// READ semua buku
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    res.json(books)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// SEARCH buku (by judul atau penulis)
app.get('/books/search', async (req, res) => {
  const q = req.query.q || ''
  try {
    const books = await Book.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ]
    })
    res.json(books)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend A berjalan di http://localhost:${PORT}`)
})
