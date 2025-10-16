# Monitoring Setup for TP2 DevOps

This directory contains the Grafana monitoring configuration for the TP2 DevOps project.

## Structure

```
monitoring/
├── Dockerfile.grafana          # Grafana container configuration
├── grafana.ini                 # Grafana server configuration
├── provisioning/               # Auto-provisioning configurations
│   ├── dashboards/
│   │   └── dashboard.yml       # Dashboard provider configuration
│   └── datasources/
│       └── datasource.yml      # Data source configuration
└── dashboards/
    └── application-monitoring.json  # Main application dashboard
```

## Features

### Metrics Collected
- **HTTP Metrics**: Request rate, response time, error rate
- **Business Metrics**: User operations (CRUD), database response time
- **System Metrics**: Active connections, application errors
- **Infrastructure Metrics**: CPU, memory, network (via Prometheus default metrics)

### Dashboard Panels
1. **HTTP Request Rate**: Shows requests per second by method, route, and status
2. **Response Time**: 95th and 50th percentile response times
3. **Error Rate**: Percentage of 4xx/5xx responses
4. **Active Connections**: Current active connection count
5. **User Operations**: CRUD operations rate and success/failure
6. **Database Response Time**: Query performance metrics
7. **Application Errors**: Error tracking by type and endpoint

### Alerts (to be configured)
- High error rate (>5% 5xx responses)
- Slow response times (>2s 95th percentile)
- High database response time (>100ms 95th percentile)
- No recent requests (possible service down)

## Local Development

1. Build Grafana container:
```bash
cd monitoring
docker build -f Dockerfile.grafana -t tp2-grafana .
```

2. Run Grafana:
```bash
docker run -p 3000:3000 \
  -e GF_SECURITY_ADMIN_PASSWORD=admin123 \
  -e BACKEND_URL=http://host.docker.internal:4000 \
  tp2-grafana
```

3. Access Grafana at http://localhost:3000
   - Username: admin
   - Password: admin123

## Production Deployment

The monitoring stack is automatically deployed with the application via the CI/CD pipeline and render.yaml configuration.

Environment variables required:
- `GF_SECURITY_ADMIN_PASSWORD`: Grafana admin password
- `BACKEND_URL`: Backend service URL for metrics scraping

## Customization

To add new metrics:
1. Add metric definitions in `backend/metrics.js`
2. Use metrics in your application code
3. Update dashboard JSON to visualize new metrics
4. Redeploy the application