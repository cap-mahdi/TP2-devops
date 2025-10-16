# Environment Variables Reference

This document explains all environment variables used in the application.

## 📋 Overview

The application uses environment variables for:
- Configuration flexibility (dev vs production)
- Connecting frontend to backend
- CORS security
- Port configuration

## 🔧 Backend Environment Variables

### Development (.env file)
Located at: `backend/.env`

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

### Production (Render Dashboard)

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `NODE_ENV` | `production` | Yes | Environment mode |
| `PORT` | `10000` | Auto | Port number (Render sets automatically) |
| `FRONTEND_URL` | Frontend URL | Yes | For CORS configuration |
| `LOG_LEVEL` | `info` | No | Winston log level (default: info) |

**Example Production Values:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://tp2-devops-frontend.onrender.com
LOG_LEVEL=info
```

### How Backend Uses These Variables

```javascript
// Port configuration
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Logging level
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  // ...
});
```

---

## 🎨 Frontend Environment Variables

### Development (.env file)
Located at: `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:4000
```

### Production (Render Dashboard)

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `NODE_ENV` | `production` | Yes | Environment mode |
| `REACT_APP_API_URL` | Backend URL | Yes | Backend API base URL |

**Example Production Values:**
```
NODE_ENV=production
REACT_APP_API_URL=https://tp2-devops-backend.onrender.com
```

### How Frontend Uses These Variables

```typescript
// API URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const API_URL = `${API_BASE_URL}/users`;

// All API calls use this URL
fetch(API_URL)
  .then(res => res.json())
  .then(setUsers);
```

### ⚠️ Important Notes for React Environment Variables

1. **Prefix Required**: All custom env vars MUST start with `REACT_APP_`
2. **Build Time Only**: Values are embedded at build time, not runtime
3. **Rebuild Required**: If you change env vars, you must rebuild
4. **No Trailing Slash**: Don't add `/` at the end of URL
5. **No Path Suffix**: Don't add `/users` or any path

✅ **Correct**: `REACT_APP_API_URL=https://backend.onrender.com`
❌ **Wrong**: `REACT_APP_API_URL=https://backend.onrender.com/`
❌ **Wrong**: `REACT_APP_API_URL=https://backend.onrender.com/users`

---

## 🔄 Environment Setup Workflow

### Local Development Setup

1. **Copy example files:**
```powershell
# Backend
cd backend
copy .env.example .env

# Frontend
cd ../frontend
copy .env.example .env
```

2. **Edit .env files** with your local configuration (already set for localhost)

3. **Start services:**
```powershell
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm start
```

### Production Deployment Setup

1. **Deploy Backend First** (see RENDER-DEPLOYMENT.md)
   - Set `NODE_ENV`, `PORT`, `LOG_LEVEL`
   - Leave `FRONTEND_URL` empty
   - Get backend URL

2. **Deploy Frontend** (see RENDER-DEPLOYMENT.md)
   - Set `NODE_ENV`
   - Set `REACT_APP_API_URL` to backend URL
   - Get frontend URL

3. **Update Backend CORS**
   - Add `FRONTEND_URL` with frontend URL
   - Backend auto-redeploys

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Symptom:** "Failed to fetch" errors, CORS errors

**Check:**
```powershell
# 1. Verify frontend env var
echo $env:REACT_APP_API_URL  # Local
# Or check Render Dashboard → Frontend → Environment

# 2. Test backend directly
curl https://your-backend-url.onrender.com/health
```

**Solutions:**
- Ensure `REACT_APP_API_URL` has NO trailing slash
- Ensure `REACT_APP_API_URL` has NO path (no `/users`)
- Rebuild frontend after changing env vars
- Check backend `FRONTEND_URL` matches frontend URL exactly

### Backend CORS Errors

**Symptom:** "CORS policy" errors in browser console

**Check:**
```
Render Dashboard → Backend → Environment → FRONTEND_URL
```

**Solutions:**
- Ensure `FRONTEND_URL` exactly matches frontend URL
- No trailing slash in `FRONTEND_URL`
- Include `https://` in `FRONTEND_URL`
- Restart backend after changing env vars

### Environment Variables Not Working

**Frontend:**
- Variables must start with `REACT_APP_`
- Must rebuild after changing variables
- Check browser Network tab for actual API calls

**Backend:**
- Check Render logs for env var values
- Variables take effect after restart/redeploy
- Use `console.log(process.env.VARIABLE_NAME)` to debug

---

## 📝 Environment Variables Checklist

### Before Local Development
- [ ] Created `backend/.env` from `.env.example`
- [ ] Created `frontend/.env` from `.env.example`
- [ ] Verified `REACT_APP_API_URL` points to `http://localhost:4000`
- [ ] Verified `FRONTEND_URL` points to `http://localhost:3000`

### Before Render Deployment
- [ ] Backend `NODE_ENV` set to `production`
- [ ] Backend `LOG_LEVEL` set to `info`
- [ ] Backend `FRONTEND_URL` will be added after frontend deployment
- [ ] Frontend `NODE_ENV` set to `production`
- [ ] Frontend `REACT_APP_API_URL` set to exact backend URL (no trailing slash)

### After Deployment
- [ ] Updated backend `FRONTEND_URL` with frontend URL
- [ ] Tested API connection from frontend
- [ ] No CORS errors in browser console
- [ ] All CRUD operations work

---

## 🔒 Security Best Practices

1. **Never commit .env files** (already in .gitignore)
2. **Use .env.example** for documentation only (no real values)
3. **Rotate API keys** if accidentally committed
4. **Use Render's secret management** for sensitive data
5. **Validate environment variables** on startup

---

## 📚 Additional Resources

- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

**Need help?** Check RENDER-DEPLOYMENT.md for complete deployment guide.
