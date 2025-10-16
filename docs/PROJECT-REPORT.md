# Project Report

> TP2-devops — cap-mahdi  
> Date: 2025-10-16

---

## 1) Tech Stack

- Frontend: React 18 (TypeScript), Tailwind CSS, CRA (react-scripts 5)
- Backend: Node.js 18, Express 4, CORS, in-memory CRUD for /users
- Observability libs: Winston (logs), prom-client (metrics), OpenTelemetry (traces)
- DevOps/Platform: Render (Backend: Web Service, Frontend: Static Site), GitHub Actions (CI/CD)

Key URLs:
- Backend: https://tp2-devops-backend.onrender.com
- Frontend: https://tp2-devops-frontend.onrender.com

---

## 2) CI/CD Pipeline

- Platform: GitHub Actions (`.github/workflows/ci-cd.yml`)
- Triggers: Push/PR to `main`
- Jobs:
  - Backend: Node 18, npm ci, tests (if present), basic build step, trigger Render deploy via API
  - Frontend: Node 18, npm ci, tests (if present), `npm run build`, trigger Render deploy via API
- Secrets required:
  - `RENDER_API_KEY`, `RENDER_BACKEND_SERVICE_ID`, `RENDER_FRONTEND_SERVICE_ID`
- Artifacts: Build output (frontend) compiled in CI; Render performs build on deploy as well

Pipeline overview:
```
Push → GitHub Actions
   ├─ Backend job: install, test, build, deploy
   └─ Frontend job: install, test, build, deploy
```

---

## 3) Observability Architecture

Goals: logs, metrics, traces across the backend service.

Data flow:
```
Client → Frontend → Backend (Express)
   ├─ Logs: Winston → (Console + Loki)
   ├─ Metrics: prom-client (/metrics) → Grafana Cloud Prometheus (remote_write)
   └─ Traces: OpenTelemetry → Grafana Cloud Tempo (OTLP HTTP)
```

Endpoints in app:
- Health: `/health`
- Metrics: `/metrics`
- CRUD: `/users` (GET/POST/PUT/DELETE)

---

## 4) Choice: Grafana Cloud (Why)

- All-in-one with open standards (Prometheus/Loki/Tempo)
- Generous free tier for small projects
- Works with existing app (prom-client, OpenTelemetry) with minimal changes
- Powerful dashboards and alerting

Setup references:
- Full guide: `docs/observability/GRAFANA-CLOUD-REPORT.md`

---

## 5) Implementation Details

### 5.1 Logs (Loki)
- Library: `winston` + `winston-loki`
- Transport configuration uses environment variables:
  - `GRAFANA_LOKI_URL`
  - `GRAFANA_CLOUD_USER` (if needed) / `GRAFANA_CLOUD_API_KEY`
- Labels: `service=tp2-backend`, `env=production|development`

Sample query (LogQL):
```
{service="tp2-backend"}
```

### 5.2 Metrics (Prometheus)
- Library: `prom-client` exposing `/metrics`
- Collector: Grafana Alloy or Prometheus remote_write to Grafana Cloud
- Env vars:
  - `GRAFANA_PROM_REMOTE_WRITE_URL`
  - `GRAFANA_CLOUD_USER` / `GRAFANA_CLOUD_API_KEY`

Sample PromQL:
```
sum by (route, status) (increase(http_requests_total[5m]))
```

### 5.3 Traces (Tempo)
- Library: OpenTelemetry with `@opentelemetry/exporter-otlp-http`
- Env vars:
  - `GRAFANA_TEMPO_OTLP_HTTP_URL`
  - `GRAFANA_CLOUD_API_KEY` (Bearer)

Trace exploration: Grafana → Explore → Tempo → filter by service `tp2-backend` and operation `GET /users`.

---

## 6) Environment Variables

Backend (Render → Environment):
```
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
FRONTEND_URL=https://tp2-devops-frontend.onrender.com

# Grafana Cloud
GRAFANA_PROM_REMOTE_WRITE_URL=...
GRAFANA_LOKI_URL=...
GRAFANA_TEMPO_OTLP_HTTP_URL=...
GRAFANA_CLOUD_USER=...
GRAFANA_CLOUD_API_KEY=...
```

Keep secrets in Render; do not commit.

---

## 7) Validation Checklist

- Backend /health returns 200
- Backend /metrics returns Prometheus format
- Logs appear in Loki with label `service=tp2-backend`
- Traces visible in Tempo for key routes
- Grafana dashboards show requests, errors, latency
- Alerts configured (optional) for error rate and latency

---

## 8) Placeholder Screenshots

- CI/CD Pipeline run (GitHub Actions):
  ![PLACEHOLDER - CI Pipeline](./assets/placeholders/ci-pipeline.png)

- Metrics dashboard (Prometheus):
  ![PLACEHOLDER - Metrics Dashboard](./assets/placeholders/metrics-dashboard.png)

- Logs (Loki Explore):
  ![PLACEHOLDER - Logs Explore](./assets/placeholders/logs-explore.png)

- Traces (Tempo Waterfall):
  ![PLACEHOLDER - Traces Waterfall](./assets/placeholders/traces-waterfall.png)

---

Prepared by: Automation assistant  
Repo: cap-mahdi/TP2-devops
