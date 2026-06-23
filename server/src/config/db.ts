import mongoose from 'mongoose';
import { env } from './env.js';

let gridfsBucket: mongoose.mongo.GridFSBucket | null = null;

export async function connectDb(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 8000,
  });
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db!, { bucketName: 'media' });
  return conn;
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getGridFSBucket(): mongoose.mongo.GridFSBucket {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized — call connectDb() first');
  }
  return gridfsBucket;
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  gridfsBucket = null;
}
