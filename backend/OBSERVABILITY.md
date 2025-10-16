# Backend Observability

This backend includes comprehensive observability features for monitoring, logging, and tracing.

## Features

### 1. **Structured Logging (Winston)**
- JSON-formatted logs with timestamps
- Color-coded console output for development
- Logs all HTTP requests and responses with duration
- Logs CRUD operations on users

**Log Levels:**
- `info`: Normal operations (requests, CRUD actions)
- `warn`: Warning conditions (user not found)
- `error`: Error conditions (captured by error handlers)

### 2. **Metrics (Prometheus)**
- Exposed at `http://localhost:4000/metrics`
- Default Node.js metrics (memory, CPU, event loop, etc.)
- Custom metrics:
  - `http_requests_total`: Counter for total HTTP requests (labeled by method, route, status code)
  - `http_request_duration_seconds`: Histogram for request duration (labeled by method, route, status code)

**View Metrics:**
```bash
curl http://localhost:4000/metrics
```

### 3. **Distributed Tracing (OpenTelemetry)**
- Automatic instrumentation of HTTP requests
- Console span exporter (logs trace data to console)
- Ready to integrate with OTLP-compatible backends (Jaeger, Tempo, etc.)
- Captures end-to-end request traces

**Trace Output:**
Traces are printed to the console showing:
- Trace ID
- Span ID
- Parent Span ID
- Operation name
- Duration
- Attributes (HTTP method, URL, status code)

### 4. **Health Check Endpoint**
- Available at `http://localhost:4000/health`
- Returns server status and timestamp

## Example Output

### Console Logs
```
2025-10-16T10:30:45.123Z [info]: Backend server started {"port":4000,"environment":"development"}
2025-10-16T10:30:50.456Z [info]: Incoming request {"method":"GET","url":"/users","ip":"::1"}
2025-10-16T10:30:50.460Z [info]: Fetching all users {"count":2}
2025-10-16T10:30:50.461Z [info]: Request completed {"method":"GET","url":"/users","status":200,"duration":"0.005s"}
```

### Metrics Sample
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/users",status_code="200"} 5

# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.005",method="GET",route="/users",status_code="200"} 4
http_request_duration_seconds_sum{method="GET",route="/users",status_code="200"} 0.023
http_request_duration_seconds_count{method="GET",route="/users",status_code="200"} 5
```

### Trace Sample
```json
{
  "traceId": "7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c",
  "spanId": "1a2b3c4d5e6f7890",
  "name": "GET /users",
  "kind": 1,
  "timestamp": 1697456450456000,
  "duration": 5000,
  "attributes": {
    "http.method": "GET",
    "http.url": "/users",
    "http.status_code": 200
  }
}
```

## Future Enhancements

To send observability data to external systems:

1. **Logging**: Add Winston transports for external services
   - File transport
   - Elasticsearch
   - CloudWatch
   - Datadog

2. **Metrics**: Configure Prometheus scraping or push gateway
   - Add `prom-client` push gateway integration
   - Set up Prometheus server to scrape `/metrics`

3. **Tracing**: Replace ConsoleSpanExporter with OTLP exporter
   ```javascript
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
   
   const sdk = new NodeSDK({
     traceExporter: new OTLPTraceExporter({
       url: 'http://jaeger:4318/v1/traces' // or Tempo, Zipkin, etc.
     }),
     instrumentations: [getNodeAutoInstrumentations()],
   });
   ```

## Testing Observability

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Make some requests:
   ```bash
   # Get users
   curl http://localhost:4000/users
   
   # Create user
   curl -X POST http://localhost:4000/users -H "Content-Type: application/json" -d '{"name":"Charlie","email":"charlie@example.com"}'
   
   # Update user
   curl -X PUT http://localhost:4000/users/1 -H "Content-Type: application/json" -d '{"name":"Alice Updated","email":"alice.new@example.com"}'
   
   # Delete user
   curl -X DELETE http://localhost:4000/users/2
   
   # Check metrics
   curl http://localhost:4000/metrics
   
   # Check health
   curl http://localhost:4000/health
   ```

3. Observe:
   - Structured logs in the console
   - Metrics at `/metrics` endpoint
   - Trace spans in the console
