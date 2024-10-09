import express from 'express';
import morgan from 'morgan';

// Initialize app
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/welcome', (req, res) => {
  res.status(200).json({
    message: 'Welcome to my API',
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

export default app;
