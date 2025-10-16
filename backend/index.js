import express from 'express';
import cors from 'cors';
import winston from 'winston';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { 
  register, 
  trackConnections, 
  collectHttpMetrics, 
  recordUserOperation,
  recordDatabaseOperation 
} from './metrics.js';

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

// Connection tracking middleware
app.use(trackConnections);

// Metrics collection middleware
app.use(collectHttpMetrics);

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
  const start = Date.now();
  logger.info('Fetching all users', { count: users.length });
  
  // Simulate database operation timing
  recordDatabaseOperation('select_users', Date.now() - start);
  recordUserOperation('fetch_all', 'success');
  
  res.json(users);
});

// POST /users
app.post('/users', (req, res) => {
  const start = Date.now();
  const { name, email } = req.body;
  logger.info('Creating new user', { name, email });
  
  try {
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id, name, email };
    users.push(newUser);
    
    // Record successful operation metrics
    recordDatabaseOperation('insert_user', Date.now() - start);
    recordUserOperation('create', 'success');
    
    logger.info('User created successfully', { userId: id });
    res.status(201).json(newUser);
  } catch (error) {
    recordUserOperation('create', 'error');
    logger.error('Error creating user', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /users/:id
app.put('/users/:id', (req, res) => {
  const start = Date.now();
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  logger.info('Updating user', { userId: id, name, email });
  
  const user = users.find(u => u.id === id);
  if (!user) {
    recordUserOperation('update', 'not_found');
    logger.warn('User not found for update', { userId: id });
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.name = name;
  user.email = email;
  
  recordDatabaseOperation('update_user', Date.now() - start);
  recordUserOperation('update', 'success');
  
  logger.info('User updated successfully', { userId: id });
  res.json(user);
});

// DELETE /users/:id
app.delete('/users/:id', (req, res) => {
  const start = Date.now();
  const id = parseInt(req.params.id);
  logger.info('Deleting user', { userId: id });
  
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    recordUserOperation('delete', 'not_found');
    logger.warn('User not found for deletion', { userId: id });
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(idx, 1);
  
  recordDatabaseOperation('delete_user', Date.now() - start);
  recordUserOperation('delete', 'success');
  
  logger.info('User deleted successfully', { userId: id });
  res.status(204).end();
});


// Add a test endpoint
app.get('/test-cicd', (req, res) => {
  res.json({ 
    message: 'CI/CD Pipeline Test', 
    timestamp: new Date().toISOString(),
    version: '1.0.1'
  });
});

// ===== START SERVER =====
app.listen(port, () => {
  logger.info(`Backend server started`, { port, environment: 'development' });
  logger.info(`Metrics available at http://localhost:${port}/metrics`);
  logger.info(`Health check available at http://localhost:${port}/health`);
});
