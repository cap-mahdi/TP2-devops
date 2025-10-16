# Render Deployment Guide - Complete Setup

This guide walks you through deploying your full-stack application to Render with proper environment configuration.

## 📋 Overview

We'll deploy:
- **Backend**: Node.js Web Service (Express API)
- **Frontend**: Static Site (React app)

Both services will communicate via environment variables.

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

#### 1.1 Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:

**Basic Settings:**
```
Name:              tp2-devops-backend
Region:            Oregon (US West) - or closest to your users
Branch:            main
Root Directory:    backend
Runtime:           Node
Build Command:     npm install
Start Command:     npm start
```

**Instance Type:**
```
Plan:              Free (or your choice)
```

#### 1.2 Configure Backend Environment Variables

In the **Environment** section, add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port (Render assigns this automatically) |
| `LOG_LEVEL` | `info` | Logging level |
| `FRONTEND_URL` | Leave empty for now | Will add after frontend deployment |

> **Note**: Render automatically sets `PORT` to 10000, but our app respects this via `process.env.PORT`

#### 1.3 Deploy Backend

1. Click **Create Web Service**
2. Wait for deployment to complete (2-3 minutes)
3. **Copy the backend URL** from the dashboard
   - Example: `https://tp2-devops-backend.onrender.com`

#### 1.4 Test Backend

Once deployed, test these endpoints:

```bash
# Health check
curl https://YOUR-BACKEND-URL.onrender.com/health

# Get users
curl https://YOUR-BACKEND-URL.onrender.com/users

# Metrics
curl https://YOUR-BACKEND-URL.onrender.com/metrics
```

✅ Backend should return responses successfully!

---

### Step 2: Deploy Frontend

#### 2.1 Create Frontend Static Site

1. Go to Render Dashboard
2. Click **New +** → **Static Site**
3. Connect your GitHub repository
4. Configure:

**Basic Settings:**
```
Name:              tp2-devops-frontend
Region:            Oregon (US West) - same as backend
Branch:            main
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: build
```

#### 2.2 Configure Frontend Environment Variables

**CRITICAL**: Set the backend URL before deploying!

In the **Environment** section, add:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | N/A |
| `REACT_APP_API_URL` | Your backend URL (NO trailing slash, NO /users) | `https://tp2-devops-backend.onrender.com` |

> ⚠️ **IMPORTANT**: 
> - Use the EXACT backend URL from Step 1.3
> - Do NOT include `/users` or any path
> - Do NOT include trailing slash
> - Example: `https://tp2-devops-backend.onrender.com`

#### 2.3 Deploy Frontend

1. Click **Create Static Site**
2. Wait for build to complete (3-5 minutes)
3. **Copy the frontend URL** from the dashboard
   - Example: `https://tp2-devops-frontend.onrender.com`

---

### Step 3: Update Backend CORS

Now that frontend is deployed, update backend to allow frontend origin:

1. Go to **Backend service** in Render Dashboard
2. Navigate to **Environment** tab
3. Add/Update:

| Key | Value | Example |
|-----|-------|---------|
| `FRONTEND_URL` | Your frontend URL | `https://tp2-devops-frontend.onrender.com` |

4. Click **Save Changes**
5. Backend will automatically redeploy

---

### Step 4: Verify Deployment

#### 4.1 Test Backend Endpoints

```bash
# Replace with your actual backend URL
BACKEND_URL="https://tp2-devops-backend.onrender.com"

# Health check
curl $BACKEND_URL/health

# Should return: {"status":"ok","timestamp":"..."}

# Get users
curl $BACKEND_URL/users

# Should return: [{"id":1,"name":"Alice",...},{"id":2,"name":"Bob",...}]

# Metrics
curl $BACKEND_URL/metrics

# Should return Prometheus metrics
```

#### 4.2 Test Frontend

1. Open your frontend URL in browser
   - Example: `https://tp2-devops-frontend.onrender.com`

2. Verify:
   - ✅ Page loads without errors
   - ✅ User list displays (Alice and Bob)
   - ✅ Can add new user
   - ✅ Can edit user
   - ✅ Can delete user
   - ✅ No CORS errors in browser console (F12)

#### 4.3 Test Full CRUD Flow

1. **Create**: Add a new user
   - Name: "Test User"
   - Email: "test@example.com"
   - Click "Add"

2. **Read**: User should appear in list immediately

3. **Update**: Click "Edit" on test user
   - Change name to "Updated User"
   - Click "Update"

4. **Delete**: Click "Delete" on test user
   - User should disappear from list

✅ If all operations work, deployment is successful!

---

## 🔧 Environment Variables Summary

### Backend Environment Variables

| Variable | Development | Production (Render) |
|----------|-------------|---------------------|
| `NODE_ENV` | `development` | `production` |
| `PORT` | `4000` | `10000` (auto) |
| `FRONTEND_URL` | `http://localhost:3000` | `https://your-frontend.onrender.com` |
| `LOG_LEVEL` | `info` | `info` |

### Frontend Environment Variables

| Variable | Development | Production (Render) |
|----------|-------------|---------------------|
| `NODE_ENV` | `development` | `production` |
| `REACT_APP_API_URL` | `http://localhost:4000` | `https://your-backend.onrender.com` |

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Symptoms:**
- Frontend loads but no users appear
- Console errors: "Failed to fetch" or CORS errors

**Solutions:**

1. **Check backend URL in frontend env vars**
   ```
   Render Dashboard → Frontend Service → Environment
   Verify: REACT_APP_API_URL is correct (no typos, no trailing slash)
   ```

2. **Verify backend is running**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Should return `{"status":"ok",...}`

3. **Check CORS configuration**
   ```
   Render Dashboard → Backend Service → Environment
   Verify: FRONTEND_URL matches your frontend URL exactly
   ```

4. **Rebuild frontend** after changing env vars
   ```
   Render Dashboard → Frontend Service → Manual Deploy → Clear build cache & deploy
   ```

### Backend Returns 503 Service Unavailable

**Cause:** Free tier services spin down after 15 minutes of inactivity

**Solution:** 
- Wait 30-60 seconds for service to wake up
- First request after spin-down is always slow
- Consider upgrading to paid tier for always-on

### Build Fails

**Backend Build Fails:**
1. Check `package.json` has all dependencies
2. Verify `npm install` works locally
3. Check Render build logs for specific errors

**Frontend Build Fails:**
1. Ensure `REACT_APP_API_URL` is set BEFORE build
2. Check for TypeScript errors
3. Verify `npm run build` works locally
4. Check Render build logs

### CORS Errors Even After Configuration

1. **Hard refresh frontend** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear browser cache**
3. **Verify FRONTEND_URL** in backend exactly matches frontend URL
4. **Check backend logs** in Render for CORS-related messages

---

## 📝 Post-Deployment Checklist

- [ ] Backend health endpoint accessible
- [ ] Backend /users endpoint returns data
- [ ] Backend /metrics endpoint accessible
- [ ] Frontend loads without errors
- [ ] Frontend displays user list
- [ ] Can add new user
- [ ] Can edit user
- [ ] Can delete user
- [ ] No CORS errors in browser console
- [ ] Backend logs show requests from frontend
- [ ] Both services show "Live" status in Render

---

## 🔒 Security Notes

### Current Configuration
- ✅ CORS configured for specific frontend origin
- ✅ Environment variables for sensitive config
- ⚠️ No authentication (public API)
- ⚠️ No input validation
- ⚠️ No rate limiting

### Production Recommendations
1. Add authentication (JWT, OAuth)
2. Add input validation (express-validator)
3. Add rate limiting (express-rate-limit)
4. Use HTTPS only (Render provides this)
5. Add API key for metrics endpoint
6. Set up monitoring alerts

---

## 📊 Monitoring Your Deployment

### Render Dashboard
- **Logs**: Real-time logs for both services
- **Metrics**: CPU, Memory usage
- **Events**: Deployment history

### Application Monitoring
- **Health**: `https://your-backend/health`
- **Metrics**: `https://your-backend/metrics`
- **Logs**: Available in Render dashboard

### Set Up Alerts (Optional)
1. Render Dashboard → Service → Settings
2. Configure notification webhooks
3. Get notified on deployment failures or service issues

---

## 🎉 Success!

Your application is now deployed on Render with:
- ✅ Backend API serving requests
- ✅ Frontend communicating with backend
- ✅ Proper CORS configuration
- ✅ Environment variables configured
- ✅ Health checks enabled
- ✅ Observability with logs and metrics

**Your URLs:**
- Frontend: `https://your-frontend.onrender.com`
- Backend: `https://your-backend.onrender.com`
- Health: `https://your-backend.onrender.com/health`
- Metrics: `https://your-backend.onrender.com/metrics`

---

## 🔄 Making Updates

When you push to `main` branch:
1. GitHub Actions runs CI/CD pipeline
2. Tests run automatically
3. Builds are created
4. Render deployment is triggered
5. Services update automatically

**Manual Deployment:**
```
Render Dashboard → Your Service → Manual Deploy → Deploy latest commit
```

---

## 📚 Additional Resources

- [Render Node.js Documentation](https://render.com/docs/deploy-node-express-app)
- [Render Static Sites Documentation](https://render.com/docs/static-sites)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Free Tier Limits](https://render.com/docs/free)

---

**Need help?** Check the logs in Render Dashboard or create an issue in your GitHub repository.
