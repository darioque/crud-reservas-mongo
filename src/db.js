import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect('mongodb://localhost/crud-reservas');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
