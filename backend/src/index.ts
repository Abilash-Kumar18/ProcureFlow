import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import { authRouter } from './routes/authRoutes.js';
import { centreRouter } from './routes/centreRoutes.js';
import { bookingRouter } from './routes/bookingRoutes.js';
import { queueRouter } from './routes/queueRoutes.js';
import { procurementRouter } from './routes/procurementRoutes.js';
import { paymentRouter } from './routes/paymentRoutes.js';
import { notificationRouter } from './routes/notificationRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { streamRouter } from './routes/streamRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database schema
initDatabase();

// Mount API routes under /api/v1 as specified in PRD Section 11
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/centres', centreRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/queue', queueRouter);
app.use('/api/v1/procurements', procurementRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/stream', streamRouter);

// Root health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'ProcureFlow Backend Service',
    problem_statement: 'SIH 26032',
    timestamp: new Date().toISOString(),
    database: 'SQLite (ACID Compliant)',
    features: ['Transactional Booking', 'Live Queue State Machine', 'SSE Realtime', 'DBT Payment Timeline']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ProcureFlow Backend running on http://localhost:${PORT}`);
  console.log(`📡 Real-time SSE Gateway active on http://localhost:${PORT}/api/v1/stream`);
});
