import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: [env.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use('/api', apiRoutes);
app.use(errorHandler);

async function start() {
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`Sitara API listening on port ${env.port}`);
  });

  try {
    await connectDb();
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB not available — API running without database. Set MONGODB_URI to enable data routes.');
    console.warn(err instanceof Error ? err.message : err);
  }
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
