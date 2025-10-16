# Full-Stack User Management Application

> A production-ready full-stack web application demonstrating modern DevOps practices with comprehensive observability, CI/CD automation, and cloud deployment.

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](/.github/workflows/ci-cd.yml)
[![Deployment](https://img.shields.io/badge/Deploy-Render-46E3B7)](https://render.com)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Installation & Local Setup](#-installation--local-setup)
- [API Endpoints](#-api-endpoints)
- [Observability](#-observability)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Screenshots & Examples](#-screenshots--examples)
- [Extending the Application](#-extending-the-application)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

### Purpose

This project demonstrates a **complete full-stack application** with enterprise-grade practices:

- **User Management System**: Full CRUD operations for managing users
- **Modern Architecture**: Separation of frontend and backend with REST API
- **Production Observability**: Comprehensive logging, metrics, and distributed tracing  
- **Automated CI/CD**: Continuous integration and deployment with GitHub Actions
- **Cloud Deployment**: Deployed on Render with proper environment configuration
- **DevOps Best Practices**: Infrastructure as Code, environment management, automated testing

### Use Cases

- 📚 **Learning Resource**: Understand full-stack development with DevOps
- 🏗️ **Project Template**: Bootstrap new full-stack applications
- 🔍 **Observability Example**: Learn monitoring and observability patterns
- 🚀 **CI/CD Reference**: Implement automated deployment pipelines
- 💼 **Portfolio Project**: Demonstrate modern development skills

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript 5.2+** - Type Safety
- **Tailwind CSS 3.3+** - Styling
- **React Scripts 5.0+** - Build Tool

### Backend
- **Node.js 18+** - Runtime
- **Express.js 4.18+** - Web Framework
- **Winston 3.11+** - Structured Logging
- **Prometheus (prom-client) 15.1+** - Metrics Collection
- **OpenTelemetry 0.45+** - Distributed Tracing
- **CORS 2.8+** - Cross-Origin Support

### DevOps
- **GitHub Actions** - CI/CD Pipeline
- **Render** - Cloud Hosting Platform
- **npm** - Package Management

---

## ✨ Features

### Frontend
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Real-time user list display
- ✅ Add, edit, and delete users
- ✅ TypeScript for type safety
- ✅ Environment-based API configuration

### Backend
- ✅ RESTful API with Express.js
- ✅ Full CRUD operations
- ✅ CORS enabled
- ✅ Health check endpoint
- ✅ Metrics endpoint
- ✅ Structured JSON logging

### Observability
- ✅ Winston logging with structured JSON
- ✅ Prometheus metrics (HTTP requests, duration, Node.js metrics)
- ✅ OpenTelemetry distributed tracing
- ✅ Real-time request tracking

### DevOps
- ✅ GitHub Actions automated pipeline
- ✅ Automated deployment to Render
- ✅ npm caching for faster builds
- ✅ Infrastructure as Code (render.yaml)

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/tp2-devops.git
cd tp2-devops

# 2. Setup environment variables
cd backend
copy .env.example .env
cd ../frontend
copy .env.example .env
cd ..

# 3. Install backend dependencies
cd backend
npm install

# 4. Install frontend dependencies  
cd ../frontend
npm install

# 5. Start backend (Terminal 1)
cd backend
npm start
# Backend: http://localhost:4000

# 6. Start frontend (Terminal 2)
cd frontend
npm start
# Frontend: http://localhost:3000
```

### Verify Installation

```bash
# Health check
curl http://localhost:4000/health

# Get users
curl http://localhost:4000/users

# Metrics
curl http://localhost:4000/metrics
```

**See** `QUICKSTART.md` for detailed setup instructions.

---

## 📡 API Endpoints

**Base URL**: `http://localhost:4000` (dev) | `https://your-backend.onrender.com` (prod)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/health` | Health check | - | `{"status":"ok","timestamp":"..."}` |
| GET | `/metrics` | Prometheus metrics | - | Prometheus format |
| GET | `/users` | Get all users | - | `User[]` |
| POST | `/users` | Create user | `{name, email}` | `User` |
| PUT | `/users/:id` | Update user | `{name, email}` | `User` |
| DELETE | `/users/:id` | Delete user | - | `204 No Content` |

### Example Requests

**Get all users:**
```bash
curl http://localhost:4000/users
```

**Create user:**
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Update user:**
```bash
curl -X PUT http://localhost:4000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

**Delete user:**
```bash
curl -X DELETE http://localhost:4000/users/1
```

### Response Examples

**GET /users - Success (200)**
```json
[
  {"id": 1, "name": "John Doe", "email": "john@example.com"},
  {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
]
```

**POST /users - Success (201)**
```json
{"id": 3, "name": "Bob Wilson", "email": "bob@example.com"}
```

**GET /health - Success (200)**
```json
{"status": "ok", "timestamp": "2025-01-16T10:30:45.123Z"}
```

---

## 📊 Observability

The backend includes **production-grade observability** with three pillars:

### 1. 📝 Logging (Winston)

**Features:**
- Structured JSON logs with timestamps
- Colored console output
- Request/response logging
- CRUD operation tracking
- Configurable log levels

**Example Logs:**
```
2025-10-16T10:30:45.123Z [info]: Backend server started {"port":4000}
2025-10-16T10:30:50.456Z [info]: Incoming request {"method":"GET","url":"/users"}
2025-10-16T10:30:50.460Z [info]: Fetching all users {"count":2}
2025-10-16T10:30:50.461Z [info]: Request completed {"status":200,"duration":"0.005s"}
```

**Configuration:**
```javascript
// Set log level via environment variable
LOG_LEVEL=debug  // Options: error, warn, info, debug
```

### 2. 📈 Metrics (Prometheus)

**Endpoint:** `/metrics`

**Custom Metrics:**
- `http_requests_total` - Total HTTP requests (counter)
- `http_request_duration_seconds` - Request duration (histogram)
- Default Node.js metrics (memory, CPU, event loop, GC)

**Example:**
```bash
curl http://localhost:4000/metrics
```

**Sample Output:**
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/users",status="200"} 45

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.005",method="GET",route="/users"} 30
http_request_duration_seconds_bucket{le="0.01",method="GET",route="/users"} 42
```

### 3. 🔍 Tracing (OpenTelemetry)

**Features:**
- Automatic HTTP instrumentation
- Span creation for each request
- Console exporter (development)
- Ready for production exporters (Jaeger, Tempo)

**Example Trace Output:**
```json
{
  "traceId": "a1b2c3d4e5f6...",
  "spanId": "123456789abc",
  "name": "GET /users",
  "kind": "SERVER",
  "startTime": "2025-01-16T10:30:50.450Z",
  "endTime": "2025-01-16T10:30:50.461Z",
  "attributes": {
    "http.method": "GET",
    "http.url": "/users",
    "http.status_code": 200
  }
}
```

**See** `backend/OBSERVABILITY.md` for detailed documentation.

---

## 🔄 CI/CD Pipeline

Automated pipeline using **GitHub Actions** - builds, tests, and deploys on every push to `main`.

### Pipeline Flow

```
Push to main → GitHub Actions Triggered
    ↓
┌─────────────────────────┬─────────────────────────┐
│   Backend Pipeline      │   Frontend Pipeline     │
│                         │                         │
│ 1. Checkout code        │ 1. Checkout code        │
│ 2. Setup Node.js 18     │ 2. Setup Node.js 18     │
│ 3. Cache npm deps       │ 3. Cache npm deps       │
│ 4. npm ci (install)     │ 4. npm ci (install)     │
│ 5. npm test             │ 5. npm test             │
│ 6. Build                │ 6. npm run build        │
│ 7. Deploy to Render     │ 7. Deploy to Render     │
└─────────────────────────┴─────────────────────────┘
    ↓                         ↓
Backend Live            Frontend Live
```

### Key Features
- ✅ **Parallel execution** - Frontend and backend jobs run simultaneously
- ✅ **npm caching** - Reduces build time from 2min to 30sec
- ✅ **Automated testing** - Runs test suites before deployment
- ✅ **Automatic Render deployment** - Triggers deployment via Render API
- ✅ **Build artifact upload** - Saves build artifacts for 30 days

### Configuration

**Required GitHub Secrets:**
- `RENDER_API_KEY` - Your Render API key
- `RENDER_BACKEND_SERVICE_ID` - Backend service ID from Render
- `RENDER_FRONTEND_SERVICE_ID` - Frontend service ID from Render

**Pipeline File:** `.github/workflows/ci-cd.yml`

**See** `CI-CD-SETUP.md` for complete configuration guide.

---

## 🚀 Deployment

### Deploy to Render

**Quick Steps:**

#### 1. Backend Service (Web Service)
- **Type:** Web Service
- **Name:** `tp2-devops-backend`
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NODE_ENV=production`
  - `PORT=10000`
  - `LOG_LEVEL=info`
  - `FRONTEND_URL=https://your-frontend-url.onrender.com` (add after frontend deployment)

#### 2. Frontend Service (Static Site)
- **Type:** Static Site
- **Name:** `tp2-devops-frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`
- **Environment Variables:**
  - `REACT_APP_API_URL=https://your-backend-url.onrender.com`

#### 3. Update Backend CORS
After both services are deployed:
- Go to backend service settings
- Add `FRONTEND_URL` environment variable with your frontend URL
- Redeploy backend

### Deployment Checklist

- [ ] Backend service created and deployed
- [ ] Frontend service created and deployed
- [ ] Backend `FRONTEND_URL` configured
- [ ] Frontend `REACT_APP_API_URL` configured
- [ ] Test backend health endpoint
- [ ] Test frontend loading
- [ ] Test CRUD operations
- [ ] Verify logs in Render dashboard
- [ ] Check metrics endpoint

**See** `RENDER-DEPLOYMENT.md` for complete deployment guide and `DEPLOYMENT-CHECKLIST.md` for verification steps.

---

## 📸 Screenshots & Examples

### Frontend UI

**User List View:**
```
┌─────────────────────────────────────────────┐
│  User Management                            │
├─────────────────────────────────────────────┤
│                                             │
│  Add New User                               │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │ Name         │  │ Email             │    │
│  └──────────────┘  └──────────────────┘    │
│  [Add User]                                 │
│                                             │
│  Users                                      │
│  ┌─────────────────────────────────────┐   │
│  │ John Doe                            │   │
│  │ john@example.com                    │   │
│  │ [Edit] [Delete]                     │   │
│  ├─────────────────────────────────────┤   │
│  │ Jane Smith                          │   │
│  │ jane@example.com                    │   │
│  │ [Edit] [Delete]                     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Backend Logs

**Development Mode:**
```bash
$ npm start

2025-01-16T10:30:45.123Z [info]: Backend server started on port 4000
2025-01-16T10:30:50.456Z [info]: GET /users
2025-01-16T10:30:50.460Z [info]: Fetching all users {"count":2}
2025-01-16T10:30:50.461Z [info]: Request completed {"status":200,"duration":"0.005s"}
```

### Metrics Endpoint

**Prometheus Metrics:**
```bash
$ curl http://localhost:4000/metrics

# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/users",status="200"} 45
http_requests_total{method="POST",route="/users",status="201"} 12

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_sum{method="GET",route="/users"} 0.225
http_request_duration_seconds_count{method="GET",route="/users"} 45

# HELP nodejs_heap_size_used_bytes Process heap size used
# TYPE nodejs_heap_size_used_bytes gauge
nodejs_heap_size_used_bytes 12345678
```

### CI/CD Pipeline

**GitHub Actions Workflow:**
```
✓ backend
  ✓ Checkout code
  ✓ Setup Node.js 18
  ✓ Cache dependencies
  ✓ Install dependencies
  ✓ Run tests
  ✓ Build
  ✓ Deploy to Render

✓ frontend
  ✓ Checkout code
  ✓ Setup Node.js 18
  ✓ Cache dependencies
  ✓ Install dependencies
  ✓ Run tests
  ✓ Build
  ✓ Deploy to Render
```

---

## 🔧 Extending the Application

### 1. Add Database (PostgreSQL)

**Install Prisma:**
```bash
cd backend
npm install @prisma/client
npm install -D prisma
```

**Initialize Prisma:**
```bash
npx prisma init
```

**Define Schema (prisma/schema.prisma):**
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```

**Update backend to use Prisma:**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Replace in-memory users array
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
```

**Add to Render:**
- Create PostgreSQL database in Render
- Add `DATABASE_URL` environment variable

### 2. Add Authentication (JWT)

**Install packages:**
```bash
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

**Add auth endpoints:**
```javascript
// Register
app.post('/auth/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // Save user with hashed password
});

// Login
app.post('/auth/login', async (req, res) => {
  // Verify credentials
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.userId;
  next();
};
```

### 3. External Logging & Monitoring

**CloudWatch Logs:**
```bash
npm install winston-cloudwatch
```

```javascript
const CloudWatchTransport = require('winston-cloudwatch');
logger.add(new CloudWatchTransport({
  logGroupName: 'tp2-devops-backend',
  logStreamName: 'production'
}));
```

**Datadog:**
```bash
npm install dd-trace
```

**Elasticsearch:**
```bash
npm install @elastic/elasticsearch
```

### 4. Advanced Monitoring

**Prometheus + Grafana:**
1. Deploy Prometheus server
2. Configure scraping from `/metrics` endpoint
3. Set up Grafana dashboards
4. Add alerting rules

**Jaeger Tracing:**
```javascript
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const exporter = new JaegerExporter({
  serviceName: 'backend',
  endpoint: process.env.JAEGER_ENDPOINT
});
```

**New Relic / Sentry APM:**
```bash
npm install newrelic
npm install @sentry/node
```

### 5. Advanced CI/CD

**Add Testing:**
```bash
npm install -D jest supertest
```

**Add Code Quality:**
```bash
npm install -D eslint prettier
```

**Add Security Scanning:**
```bash
npm install -D snyk
```

**Update GitHub Actions:**
```yaml
- name: Run ESLint
  run: npm run lint
  
- name: Security Audit
  run: npm audit
  
- name: Snyk Security Scan
  run: npx snyk test
```

### 6. Add Features

**Pagination:**
```javascript
app.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const paginatedUsers = users.slice(start, start + limit);
  res.json({
    users: paginatedUsers,
    total: users.length,
    page,
    totalPages: Math.ceil(users.length / limit)
  });
});
```

**Search & Filtering:**
```javascript
app.get('/users/search', (req, res) => {
  const { q } = req.query;
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered);
});
```

**File Upload:**
```bash
npm install multer
```

**Email Notifications:**
```bash
npm install nodemailer
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| `README.md` | Complete project documentation (this file) |
| `QUICKSTART.md` | Quick start guide for local development |
| `RENDER-DEPLOYMENT.md` | Step-by-step Render deployment guide |
| `CI-CD-SETUP.md` | CI/CD pipeline configuration |
| `ENVIRONMENT-VARIABLES.md` | Environment variables reference |
| `DEPLOYMENT-CHECKLIST.md` | Deployment verification checklist |
| `ARCHITECTURE.md` | System architecture and data flow |
| `PROJECT-SUMMARY.md` | Project summary and success criteria |
| `backend/OBSERVABILITY.md` | Observability features documentation |

---

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors**
```
Error: Access to fetch at 'http://localhost:4000/users' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
- Check `FRONTEND_URL` in backend `.env`
- Ensure it matches your frontend URL exactly
- Restart backend server after changing

**2. API Connection Failed**
```
Error: Network request failed
```

**Solution:**
- Verify backend is running (`http://localhost:4000/health`)
- Check `REACT_APP_API_URL` in frontend `.env`
- Clear browser cache and restart frontend

**3. Build Failures in CI/CD**
```
npm ERR! code ELIFECYCLE
```

**Solution:**
- Check GitHub Actions logs for specific error
- Verify all dependencies in `package.json`
- Clear npm cache: `npm cache clean --force`
- Check Node.js version compatibility

**4. Render Deployment Issues**
```
Build failed: Command failed with exit code 1
```

**Solution:**
- Check Render deployment logs
- Verify build command is correct
- Ensure all environment variables are set
- Check start command matches `package.json`

**5. Environment Variables Not Working**
```
TypeError: Cannot read property 'REACT_APP_API_URL' of undefined
```

**Solution:**
- Restart development server after changing `.env`
- Prefix frontend variables with `REACT_APP_`
- Don't commit `.env` file (use `.env.example`)
- In production, set in Render dashboard

**See** `ENVIRONMENT-VARIABLES.md` for complete troubleshooting guide.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test thoroughly
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to branch** (`git push origin feature/amazing-feature`)
6. **Open Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

MIT License - See LICENSE file for details.

---

## 🙏 Acknowledgments

- React team for amazing frontend framework
- Express.js community for robust backend framework
- OpenTelemetry for observability standards
- Render for easy cloud deployment
- GitHub Actions for powerful CI/CD

---

<div align="center">

**Built with ❤️ using modern web technologies**

[GitHub](https://github.com/yourusername/tp2-devops) • [Documentation](./QUICKSTART.md) • [Issues](https://github.com/yourusername/tp2-devops/issues)

---

### Quick Links

[Installation](#-installation--local-setup) | [API Docs](#-api-endpoints) | [Observability](#-observability) | [CI/CD](#-cicd-pipeline) | [Deployment](#-deployment)

</div>
