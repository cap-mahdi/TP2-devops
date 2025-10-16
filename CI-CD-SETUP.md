# CI/CD Pipeline Documentation

This project uses GitHub Actions for continuous integration and deployment to Render.

## Pipeline Overview

The CI/CD pipeline runs on:
- **Push to `main` branch**: Runs full CI/CD including deployment
- **Pull requests to `main`**: Runs CI only (no deployment)

### Pipeline Steps

#### Backend Pipeline
1. ✅ Checkout code
2. ✅ Setup Node.js 18 with npm cache
3. ✅ Install dependencies (`npm ci`)
4. ✅ Run tests (if available)
5. ✅ Build backend
6. 🚀 Deploy to Render (main branch only)

#### Frontend Pipeline
1. ✅ Checkout code
2. ✅ Setup Node.js 18 with npm cache
3. ✅ Install dependencies (`npm ci`)
4. ✅ Run tests (if available)
5. ✅ Build production bundle
6. 📦 Upload build artifacts
7. 🚀 Deploy to Render (main branch only)

## Setup Instructions

### 1. Create Render Services

#### Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tp2-devops-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid tier)
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render sets this automatically)
   - `LOG_LEVEL`: `info`
   - `FRONTEND_URL`: Leave empty, add after frontend deployment
6. Click **Create Web Service**
7. **Copy the Service ID** from the URL (e.g., `srv-xxxxxxxxxxxxx`)
8. **Copy the Backend URL** (e.g., `https://tp2-devops-backend.onrender.com`)

#### Frontend Service
1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `tp2-devops-frontend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `REACT_APP_API_URL`: Your backend URL from Step 1 (NO trailing slash, NO /users)
     - Example: `https://tp2-devops-backend.onrender.com`
     - ⚠️ **CRITICAL**: Use the exact backend URL, no path suffix
5. Click **Create Static Site**
6. **Copy the Service ID** from the URL (e.g., `srv-xxxxxxxxxxxxx`)
7. **Copy the Frontend URL** (e.g., `https://tp2-devops-frontend.onrender.com`)

#### Update Backend CORS
After frontend is deployed, go back to backend service:
1. Navigate to **Environment** tab
2. Update `FRONTEND_URL` to your frontend URL
3. Save - backend will redeploy automatically

### 2. Get Render API Key

1. Go to [Render Account Settings](https://dashboard.render.com/account)
2. Scroll to **API Keys**
3. Click **Create API Key**
4. Name it: `GitHub Actions Deploy`
5. Copy the generated API key

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `RENDER_API_KEY` | Your Render API key | Used to trigger deployments |
| `RENDER_BACKEND_SERVICE_ID` | Backend service ID (e.g., `srv-xxxxx`) | Backend Render service |
| `RENDER_FRONTEND_SERVICE_ID` | Frontend service ID (e.g., `srv-xxxxx`) | Frontend Render service |

### 4. Verify Environment Variables

**Backend Environment Variables (in Render):**
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `LOG_LEVEL`: `info`
- `FRONTEND_URL`: `https://your-frontend-url.onrender.com`

**Frontend Environment Variables (in Render):**
- `NODE_ENV`: `production`
- `REACT_APP_API_URL`: `https://your-backend-url.onrender.com` (no trailing slash!)

**Important Notes:**
- Frontend env vars must be set BEFORE building
- If you change frontend env vars, you must rebuild
- Backend env vars can be changed anytime (will auto-redeploy)
- The frontend uses `REACT_APP_API_URL` at build time, not runtime

## Deployment Process

### Automatic Deployment
Push to `main` branch triggers automatic deployment:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The pipeline will:
1. Run tests
2. Build the applications
3. Trigger deployment on Render via API

### Manual Deployment via Render Dashboard
1. Go to your service in Render Dashboard
2. Click **Manual Deploy** → **Deploy latest commit**

### Monitor Deployment
- **GitHub Actions**: Check workflow runs in the **Actions** tab
- **Render Dashboard**: Check deployment logs in your service

## Render Configuration Files (Optional)

You can add `render.yaml` to automate service creation:

```yaml
services:
  # Backend Service
  - type: web
    name: tp2-devops-backend
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    rootDir: backend
    envVars:
      - key: NODE_ENV
        value: production
    
  # Frontend Static Site
  - type: web
    name: tp2-devops-frontend
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: build
    rootDir: frontend
    envVars:
      - key: REACT_APP_API_URL
        value: https://tp2-devops-backend.onrender.com
```

## Caching Strategy

The pipeline uses GitHub Actions caching:
- **npm cache**: Caches `node_modules` based on `package-lock.json`
- Reduces install time from ~2min to ~30sec on cache hit

## Troubleshooting

### Pipeline Fails on Tests
- Tests are set to `continue-on-error: true`, so they won't block deployment
- Add actual tests later and remove this flag

### Deployment Not Triggered
Check:
- GitHub secrets are set correctly
- Service IDs match your Render services
- API key has proper permissions

### Build Failures
- Check Render deployment logs
- Verify `package.json` scripts
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

### Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` is set in Render frontend service
- Check CORS is enabled in backend (`cors` middleware)
- Ensure backend URL is correct and accessible

## Free Tier Limitations

Render Free tier:
- ⏸️ Services spin down after 15 minutes of inactivity
- 🐌 First request after spin-down takes ~30-60 seconds
- 💾 Limited bandwidth and build minutes
- Consider upgrading for production use

## Next Steps

1. ✅ Set up Render services
2. ✅ Add GitHub secrets
3. ✅ Push to main branch
4. ✅ Monitor deployment in GitHub Actions and Render
5. 🎉 Access your live application!

## Useful Commands

```bash
# Trigger deployment manually (if auto-deploy fails)
curl -X POST "https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Check deployment status
curl "https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render API Reference](https://api-docs.render.com/)
