import { Router } from 'express';
import { sseService } from '../services/sseService.js';
import { v4 as uuidv4 } from 'uuid';

export const streamRouter = Router();

// Stream for a specific centre-day (used by operator live queue console)
streamRouter.get('/centre-days/:centreDayId', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `client-${uuidv4()}`;
  const channel = `centre:${req.params.centreDayId}`;
  sseService.addClient(clientId, channel, res);
});

// Stream for a specific booking (used by farmer tracking queue & payment status live)
streamRouter.get('/bookings/:bookingId', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `client-${uuidv4()}`;
  const channel = `booking:${req.params.bookingId}`;
  sseService.addClient(clientId, channel, res);
});

// Global stream for district admin
streamRouter.get('/global', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `client-${uuidv4()}`;
  sseService.addClient(clientId, 'global', res);
});
