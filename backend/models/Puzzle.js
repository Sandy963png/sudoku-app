import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema({
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  board: {
    type: [[Number]], // 0 represents an empty cell
    required: true
  },
  solution: {
    type: [[Number]],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Puzzle', puzzleSchema);
