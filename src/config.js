import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 27017;
export const DB_NAME = process.env.DB_NAME || 'reservasdb';
export const JWT_SECRET = process.env.JWT_SECRET || 'v8virtuosos';

export const MONGODB_URI =
  process.env.MONGODB_URI;