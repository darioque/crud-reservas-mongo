import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './db.js';
import userRoutes from './routes/user.routes.js';

// Initialize app
const app = express();

// Conect to DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: '*',
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

export default app;
