# Full-Stack Application - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS                          │
│                         (CI/CD Pipeline)                        │
│                                                                 │
│  ┌──────────────┐                      ┌──────────────┐       │
│  │   Backend    │                      │   Frontend   │       │
│  │   Pipeline   │                      │   Pipeline   │       │
│  │              │                      │              │       │
│  │ 1. Install   │                      │ 1. Install   │       │
│  │ 2. Test      │                      │ 2. Test      │       │
│  │ 3. Build     │                      │ 3. Build     │       │
│  │ 4. Deploy    │                      │ 4. Deploy    │       │
│  └──────┬───────┘                      └──────┬───────┘       │
└─────────┼──────────────────────────────────────┼──────────────┘
          │                                      │
          ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────┐
│   RENDER BACKEND    │              │  RENDER FRONTEND    │
│   (Web Service)     │◄─────────────┤  (Static Site)      │
│                     │   API Calls  │                     │
│ • Express Server    │              │ • React App         │
│ • REST API          │              │ • TypeScript        │
│ • Observability     │              │ • Tailwind CSS      │
│   - Winston Logs    │              │                     │
│   - Prometheus      │              │                     │
│   - OpenTelemetry   │              │                     │
│                     │              │                     │
│ Endpoints:          │              │ Features:           │
│ • GET /users        │              │ • List Users        │
│ • POST /users       │              │ • Add User          │
│ • PUT /users/:id    │              │ • Edit User         │
│ • DELETE /users/:id │              │ • Delete User       │
│ • GET /health       │              │                     │
│ • GET /metrics      │              │                     │
└─────────────────────┘              └─────────────────────┘
```

## 📂 Project Structure

```
tp2-devops/
│
├── 📁 backend/                    # Node.js Express API
│   ├── index.js                   # Main server with observability
│   ├── package.json               # Dependencies
│   ├── .gitignore                 # Git ignore rules
│   └── OBSERVABILITY.md           # Observability docs
│
├── 📁 frontend/                   # React TypeScript App
│   ├── 📁 src/
│   │   ├── App.tsx                # Main component (CRUD UI)
│   │   ├── index.tsx              # React entry
│   │   └── index.css              # Tailwind styles
│   ├── 📁 public/
│   │   └── index.html             # HTML template
│   ├── package.json               # Dependencies
│   ├── tsconfig.json              # TypeScript config
│   ├── tailwind.config.js         # Tailwind config
│   ├── postcss.config.js          # PostCSS config
│   └── .gitignore                 # Git ignore rules
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── ci-cd.yml              # CI/CD pipeline
│
├── render.yaml                    # Render config
├── README.md                      # Main documentation
├── CI-CD-SETUP.md                 # Deployment guide
├── QUICKSTART.md                  # Quick start guide
└── DEPLOYMENT-CHECKLIST.md        # Deployment checklist
```

## 🔄 Data Flow

```
1. USER INTERACTION
   │
   └─► Frontend (React) ─► User clicks "Add User"
                           │
                           ▼
2. API REQUEST
   │
   └─► HTTP POST to Backend
       URL: http://backend:4000/users
       Body: { "name": "John", "email": "john@example.com" }
                           │
                           ▼
3. BACKEND PROCESSING
   │
   ├─► Winston Logger ───► Logs request
   ├─► Prometheus ────────► Increments counter
   ├─► OpenTelemetry ─────► Creates trace span
   └─► Express Handler ───► Processes request
                           │
                           ▼
4. DATA STORAGE
   │
   └─► In-Memory Array ───► Stores user
       users.push(newUser)
                           │
                           ▼
5. RESPONSE
   │
   └─► Backend responds ──► Status 201 + user data
                           │
                           ▼
6. UI UPDATE
   │
   └─► Frontend receives response
       │
       └─► React state updates
           │
           └─► UI re-renders with new user
```

## 🚀 CI/CD Workflow

```
DEVELOPER                    GITHUB                    RENDER
    │                           │                         │
    │  git push origin main     │                         │
    ├──────────────────────────►│                         │
    │                           │                         │
    │                           │ Trigger Workflows       │
    │                           ├─────────┐               │
    │                           │         │               │
    │                           │  ┌──────▼──────┐        │
    │                           │  │   Backend   │        │
    │                           │  │   Pipeline  │        │
    │                           │  │             │        │
    │                           │  │ • Install   │        │
    │                           │  │ • Test      │        │
    │                           │  │ • Build     │        │
    │                           │  └──────┬──────┘        │
    │                           │         │               │
    │                           │  ┌──────▼──────┐        │
    │                           │  │  Frontend   │        │
    │                           │  │   Pipeline  │        │
    │                           │  │             │        │
    │                           │  │ • Install   │        │
    │                           │  │ • Test      │        │
    │                           │  │ • Build     │        │
    │                           │  └──────┬──────┘        │
    │                           │         │               │
    │                           │    Both Pass ✅         │
    │                           │         │               │
    │                           │  Trigger Deploy         │
    │                           ├─────────────────────────►│
    │                           │                         │
    │                           │                   ┌─────▼─────┐
    │                           │                   │  Deploy   │
    │                           │                   │  Services │
    │                           │                   └─────┬─────┘
    │                           │                         │
    │                           │              Services Live ✅
    │                           │                         │
    │   Notification (✅)       │                         │
    │◄──────────────────────────┤                         │
    │                           │                         │
```

## 🔍 Observability Stack

```
BACKEND SERVER
    │
    ├─► WINSTON (Logging)
    │   │
    │   ├─► Console Transport
    │   │   └─► Structured JSON logs
    │   │       • Timestamp
    │   │       • Level (info/warn/error)
    │   │       • Message
    │   │       • Metadata
    │   │
    │   └─► Example Output:
    │       2025-10-16T10:30:45.123Z [info]: Incoming request
    │       {"method":"GET","url":"/users","ip":"::1"}
    │
    ├─► PROMETHEUS (Metrics)
    │   │
    │   ├─► http_requests_total
    │   │   └─► Counter by method, route, status
    │   │
    │   ├─► http_request_duration_seconds
    │   │   └─► Histogram by method, route, status
    │   │
    │   └─► Default Node.js Metrics
    │       • Memory usage
    │       • CPU usage
    │       • Event loop lag
    │       • GC statistics
    │
    └─► OPENTELEMETRY (Tracing)
        │
        ├─► Auto-instrumentation
        │   └─► HTTP requests
        │
        ├─► Console Span Exporter
        │   └─► Trace data to console
        │
        └─► Trace Information:
            • Trace ID
            • Span ID
            • Duration
            • HTTP attributes
```

## 📊 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI Framework |
| | TypeScript | Type Safety |
| | Tailwind CSS | Styling |
| **Backend** | Node.js + Express | API Server |
| | Winston | Logging |
| | Prometheus | Metrics |
| | OpenTelemetry | Tracing |
| **DevOps** | GitHub Actions | CI/CD |
| | Render | Hosting |
| **Development** | npm | Package Management |
| | Git | Version Control |

## 🎯 Key Features Implemented

✅ **Full-Stack CRUD Application**
- Create, Read, Update, Delete users
- RESTful API design
- Modern React UI

✅ **Observability**
- Structured logging
- Performance metrics
- Distributed tracing

✅ **DevOps Best Practices**
- Automated CI/CD
- Separate environments
- Infrastructure as Code (render.yaml)

✅ **Production Ready**
- Error handling
- CORS configuration
- Health checks
- Monitoring endpoints

## 🔐 Security Considerations

- ✅ CORS configured
- ✅ Environment variables for sensitive data
- ✅ GitHub Secrets for API keys
- ⚠️ TODO: Add authentication/authorization
- ⚠️ TODO: Add input validation
- ⚠️ TODO: Add rate limiting

## 📈 Future Enhancements

1. **Database Integration**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Add data persistence

2. **Authentication**
   - Add JWT authentication
   - User login/registration

3. **Advanced Observability**
   - Send logs to external service (e.g., Datadog, CloudWatch)
   - Set up Prometheus scraping
   - Integrate with Jaeger for tracing

4. **Testing**
   - Add unit tests (Jest)
   - Add integration tests
   - Add E2E tests (Playwright/Cypress)

5. **Features**
   - Pagination
   - Search/filter users
   - User roles and permissions

---

**Built with ❤️ using modern web technologies**
