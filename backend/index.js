import express from 'express';
import cors from 'cors';
import winston from 'winston';
import promClient from 'prom-client';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

// ===== LOGGING SETUP (Winston) =====
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      )
    })
  ]
});

// ===== METRICS SETUP (Prometheus) =====
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// ===== TRACING SETUP (OpenTelemetry) =====
const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(), // Console exporter for development
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
logger.info('OpenTelemetry tracing initialized');

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => logger.info('Tracing terminated'))
    .catch((error) => logger.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

// ===== EXPRESS APP SETUP =====
const app = express();
const port = process.env.PORT || 4000;

// CORS configuration - allow frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}s`
    });
  });
  
  next();
});

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestCounter.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
});

// ===== DATA STORE =====
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// ===== METRICS ENDPOINT =====
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== USER CRUD ENDPOINTS =====
// GET /users
app.get('/users', (req, res) => {
  logger.info('Fetching all users', { count: users.length });
  res.json(users);
});

// POST /users
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  logger.info('Creating new user', { name, email });
  
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, name, email };
  users.push(newUser);
  
  logger.info('User created successfully', { userId: id });
  res.status(201).json(newUser);
});

// PUT /users/:id
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  logger.info('Updating user', { userId: id, name, email });
  
  const user = users.find(u => u.id === id);
  if (!user) {
    logger.warn('User not found for update', { userId: id });
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.name = name;
  user.email = email;
  logger.info('User updated successfully', { userId: id });
  res.json(user);
});

// DELETE /users/:id
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  logger.info('Deleting user', { userId: id });
  
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    logger.warn('User not found for deletion', { userId: id });
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(idx, 1);
  logger.info('User deleted successfully', { userId: id });
  res.status(204).end();
});

// ===== START SERVER =====
app.listen(port, () => {
  logger.info(`Backend server started`, { port, environment: 'development' });
  logger.info(`Metrics available at http://localhost:${port}/metrics`);
  logger.info(`Health check available at http://localhost:${port}/health`);
});
