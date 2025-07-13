import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number
}, { timestamps: true })

export default mongoose.model('Book', bookSchema)
