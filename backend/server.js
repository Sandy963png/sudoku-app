import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import puzzleRoutes from './routes/puzzleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sudoku';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.use('/api/puzzles', puzzleRoutes);

app.get('/', (req, res) => res.send('Sudoku API is running'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
