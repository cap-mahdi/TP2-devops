import promClient from 'prom-client';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'tp2-devops-backend',
  version: process.env.npm_package_version || '1.0.0'
});

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections_total',
  help: 'Number of active connections',
  registers: [register]
});

const userOperationsTotal = new promClient.Counter({
  name: 'user_operations_total',
  help: 'Total number of user operations',
  labelNames: ['operation', 'status'],
  registers: [register]
});

const databaseResponseTime = new promClient.Histogram({
  name: 'database_response_time_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [register]
});

const errorRate = new promClient.Counter({
  name: 'application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['error_type', 'endpoint'],
  registers: [register]
});

// Middleware to track active connections
let activeConnectionsCount = 0;

const trackConnections = (req, res, next) => {
  activeConnectionsCount++;
  activeConnections.set(activeConnectionsCount);
  
  res.on('finish', () => {
    activeConnectionsCount--;
    activeConnections.set(activeConnectionsCount);
  });
  
  next();
};

// Middleware to collect HTTP metrics
const collectHttpMetrics = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
      
    // Track errors
    if (res.statusCode >= 400) {
      const errorType = res.statusCode >= 500 ? 'server_error' : 'client_error';
      errorRate
        .labels(errorType, route)
        .inc();
    }
  });
  
  next();
};

// Helper functions for business logic metrics
const recordUserOperation = (operation, status) => {
  userOperationsTotal
    .labels(operation, status)
    .inc();
};

const recordDatabaseOperation = (operation, durationMs) => {
  databaseResponseTime
    .labels(operation)
    .observe(durationMs / 1000);
};

export {
  register,
  httpRequestDuration,
  httpRequestsTotal,
  activeConnections,
  userOperationsTotal,
  databaseResponseTime,
  errorRate,
  trackConnections,
  collectHttpMetrics,
  recordUserOperation,
  recordDatabaseOperation
};