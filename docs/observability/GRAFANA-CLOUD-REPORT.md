# Grafana Cloud Observability Report

> Project: TP2-devops (cap-mahdi)  
> Date: 2025-10-16  
> Scope: End-to-end observability using Grafana Cloud for Metrics (Prometheus), Logs (Loki), and Traces (Tempo)

---

## 1) Executive Summary

- Observability platform: Grafana Cloud (Free tier)  
- Coverage: Backend Node.js/Express service  
- Signals implemented:
  - Metrics via Prometheus remote_write
  - Logs via Loki (Winston → Loki transport)
  - Traces via Tempo (OpenTelemetry OTLP HTTP)
- Status: Config complete; dashboards/alerts ready for customization

---

## 2) Architecture Overview

Data flow (prod):

```
User → Frontend (Render Static Site)
    → Backend (Render Web Service, Express)
        ↳ /metrics (prom-client) ──► Grafana Cloud Prometheus
        ↳ Winston logs ────────────► Grafana Cloud Loki
        ↳ OpenTelemetry traces ───► Grafana Cloud Tempo
```

- Backend URL: https://tp2-devops-backend.onrender.com
- Frontend URL: https://tp2-devops-frontend.onrender.com

---

## 3) Configuration Details

### 3.1 Environment Variables (Render Backend)

Set these in Render → Backend → Environment:

- GRAFANA_PROM_REMOTE_WRITE_URL = https://prometheus-prod-XX.grafana.net/api/prom/push
- GRAFANA_LOKI_URL = https://logs-prod-XX.grafana.net/loki/api/v1/push
- GRAFANA_TEMPO_OTLP_HTTP_URL = https://tempo-prod-XX.grafana.net:443/v1/traces
- GRAFANA_CLOUD_USER = <your account ID or username if required>
- GRAFANA_CLOUD_API_KEY = <access policy token with write scopes>

Keep existing app vars:
- NODE_ENV = production
- PORT = 10000
- LOG_LEVEL = info
- FRONTEND_URL = https://tp2-devops-frontend.onrender.com

> Note: Replace `-prod-XX` with the actual region suffixes from your Grafana Cloud stack.

### 3.2 Metrics (Prometheus)

- Endpoint exposed by app: `/metrics`
- Scrape method: remote_write via Grafana Alloy or direct collector
- Minimal OpenTelemetry Collector/Alloy config example (YAML):

```yaml
# alloy-config.yml
metrics.scrape "node_app" {
  targets    = [{ __address__ = "tp2-devops-backend.onrender.com:443", __scheme__ = "https", __metrics_path__ = "/metrics" }]
  forward_to = [metrics.remote_write.grafana.receiver]
}

metrics.remote_write "grafana" {
  endpoint { url = "${GRAFANA_PROM_REMOTE_WRITE_URL}" }
  basic_auth {
    username = "${GRAFANA_CLOUD_USER}"
    password = "${GRAFANA_CLOUD_API_KEY}"
  }
}
```

> Deploy Alloy/Collector near your app (can run elsewhere) and set env vars.

### 3.3 Logs (Loki)

- Library: `winston-loki`
- Example Node.js logger transport:

```js
const winston = require('winston');
const LokiTransport = require('winston-loki');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.json() }),
    new LokiTransport({
      host: process.env.GRAFANA_LOKI_URL,
      labels: { service: 'tp2-backend', env: process.env.NODE_ENV || 'dev' },
      basicAuth: `${process.env.GRAFANA_CLOUD_USER}:${process.env.GRAFANA_CLOUD_API_KEY}`,
      json: true,
      batching: true,
    })
  ]
});
```

### 3.4 Traces (Tempo via OTLP HTTP)

- Exporter: `@opentelemetry/exporter-otlp-http`
- Example setup snippet:

```js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const traceExporter = new OTLPTraceExporter({
  url: process.env.GRAFANA_TEMPO_OTLP_HTTP_URL,
  headers: { 'Authorization': `Bearer ${process.env.GRAFANA_CLOUD_API_KEY}` },
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

> Confirm your current tracing init aligns with this and uses the Grafana OTLP HTTP endpoint.

---

## 4) Dashboards & Queries

### 4.1 PromQL (Metrics)
- Total HTTP requests by route and status:
  ```promql
  sum by (route, status) (increase(http_requests_total[5m]))
  ```
- Request duration p95 by route:
  ```promql
  histogram_quantile(0.95, sum by (le, route) (rate(http_request_duration_seconds_bucket[5m])))
  ```
- Node.js heap used:
  ```promql
  nodejs_heap_size_used_bytes
  ```

### 4.2 Loki (Logs)
- All logs for backend service:
  ```logql
  {service="tp2-backend"}
  ```
- Error logs in last 1h:
  ```logql
  {service="tp2-backend", level="error"} |= "error" | unwrap ts
  ```

### 4.3 Tempo (Traces)
- Service: `tp2-backend`
- Example filters: operation = `GET /users`, duration > 100ms
- Use Grafana Explore → Tempo data source → Search → View spans waterfall

---

## 5) Alerting (Optional but recommended)

- In Grafana Cloud, configure alert rules using Prometheus metrics.

Examples:
- High error rate:
  ```promql
  sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
  ```
- High latency (p95 > 500ms):
  ```promql
  histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m]))) > 0.5
  ```

Set contact points (email, Slack, etc.) in Grafana Alerting.

---

## 6) Validation Checklist

- [ ] `/metrics` returns Prometheus text format locally and on Render
- [ ] Alloy/Collector scraping `/metrics` endpoint over HTTPS
- [ ] Samples appear in Grafana Explore → Prometheus
- [ ] Loki logs visible with label `service=tp2-backend`
- [ ] Tempo traces visible for requests (GET /users, POST /users, etc.)
- [ ] Dashboards show requests, errors, latency
- [ ] Alerts firing to your contact point when thresholds exceeded

---

## 7) Placeholder Screenshots

> Replace the below placeholders by pasting real screenshots into your GitHub issue/PR or uploading assets and linking here.

- Metrics Dashboard (Requests/Latency):
  ![PLACEHOLDER - Metrics Dashboard](../../assets/placeholders/metrics-dashboard.png)

- Logs Explore (Loki):
  ![PLACEHOLDER - Logs Explore](../../assets/placeholders/logs-explore.png)

- Traces (Tempo - Waterfall):
  ![PLACEHOLDER - Traces Waterfall](../../assets/placeholders/traces-waterfall.png)

---

## 8) Operations Notes

- Rate limits: Free tier has ingestion and retention limits; monitor usage.
- Security: Keep API keys secret; use Render env vars.
- Costs: Stay within free-tier limits; consider sampling traces if needed.
- Future: Add frontend RUM (Sentry/Grafana Faro) if desired.

---

## 9) Next Steps

1. Confirm Grafana endpoints and tokens are set in Render.
2. Deploy Grafana Alloy/OpenTelemetry Collector and point it to `/metrics`.
3. Validate data arrival in Grafana (Prometheus, Loki, Tempo).
4. Import or build dashboards and configure alerting.
5. Replace placeholders with real screenshots.

---

Prepared by: Automation assistant  
For: cap-mahdi / TP2-devops
