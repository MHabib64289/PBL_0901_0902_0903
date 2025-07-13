import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  action: String,
  target: String,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Log', logSchema)
