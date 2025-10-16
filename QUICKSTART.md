# Quick Start Guide

## 🚀 Local Development

### 0. Setup Environment Variables (First Time Only)
```powershell
# Backend
cd backend
copy .env.example .env
# Already configured for localhost

# Frontend  
cd ..\frontend
copy .env.example .env
# Already configured for localhost

cd ..
```

### 1. Start Backend
```powershell
cd backend
npm install
npm start
```
✅ Backend running on http://localhost:4000

### 2. Start Frontend
```powershell
cd frontend
npm install
npm start
```
✅ Frontend running on http://localhost:3000

## 🔧 Test Endpoints

```powershell
# Health Check
Invoke-WebRequest http://localhost:4000/health

# Get Users
Invoke-WebRequest http://localhost:4000/users

# Metrics
Invoke-WebRequest http://localhost:4000/metrics
```

## 📦 Deployment to Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up / Login with GitHub

### Step 2: Create Backend Service
1. Click **New +** → **Web Service**
2. Connect your repository
3. Settings:
   - Name: `tp2-devops-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `LOG_LEVEL`: `info`
   - `FRONTEND_URL`: (leave empty for now)
5. Copy Service ID from URL
6. **Copy Backend URL** (e.g., https://tp2-devops-backend.onrender.com)

### Step 3: Create Frontend Service
1. Click **New +** → **Static Site**
2. Connect your repository
3. Settings:
   - Name: `tp2-devops-frontend`
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `build`
4. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `REACT_APP_API_URL`: **YOUR BACKEND URL** (no trailing slash!)
     - Example: `https://tp2-devops-backend.onrender.com`
     - ⚠️ NO `/users` at the end!
5. Copy Service ID from URL
6. **Copy Frontend URL** (e.g., https://tp2-devops-frontend.onrender.com)

### Step 3.5: Update Backend CORS
1. Go back to Backend service → Environment
2. Update `FRONTEND_URL` to your frontend URL
3. Save (backend will redeploy)

### Step 4: Get Render API Key
1. Account Settings → API Keys
2. Create new key
3. Copy the key

### Step 5: Add GitHub Secrets
1. GitHub repo → Settings → Secrets → Actions
2. Add secrets:
   - `RENDER_API_KEY`: (your API key)
   - `RENDER_BACKEND_SERVICE_ID`: (backend service ID)
   - `RENDER_FRONTEND_SERVICE_ID`: (frontend service ID)

### Step 6: Deploy!
```powershell
git add .
git commit -m "Deploy to production"
git push origin main
```

Check GitHub Actions tab for deployment progress!

## 📊 Monitoring

After deployment:
- **Backend Health**: https://your-backend.onrender.com/health
- **Backend Metrics**: https://your-backend.onrender.com/metrics
- **Frontend**: https://your-frontend.onrender.com
- **GitHub Actions**: Repository → Actions tab
- **Render Logs**: Render Dashboard → Your Service → Logs

## ⚠️ Important Notes

1. **Free Tier Spin-down**: Render free services sleep after 15 min inactivity
2. **First Request**: May take 30-60 seconds to wake up
3. **CORS**: Already configured in backend
4. **API URL**: Update in Render frontend env vars after backend is deployed

## 🐛 Common Issues

**Backend won't start locally:**
```powershell
# Check port 4000 is free
netstat -ano | findstr :4000

# Kill process if needed
taskkill /PID <process_id> /F
```

**Frontend can't connect:**
- Check backend is running
- Verify API_URL in App.tsx
- Check browser console for errors

**Deployment fails:**
- Check GitHub Actions logs
- Verify all secrets are set
- Check Render service logs

## 📚 Documentation

- Full README: `README.md`
- CI/CD Setup: `CI-CD-SETUP.md`
- Observability: `backend/OBSERVABILITY.md`

---

Need help? Check the docs or create an issue! 🎉
