# Deployment Checklist

Use this checklist to ensure successful deployment to Render.

## ✅ Pre-Deployment

- [ ] Code is committed to Git
- [ ] Backend runs locally without errors (`cd backend && npm start`)
- [ ] Frontend runs locally without errors (`cd frontend && npm start`)
- [ ] Frontend can connect to backend locally
- [ ] All CRUD operations work (Create, Read, Update, Delete users)

## ✅ Render Setup

### Backend Service
- [ ] Created Render Web Service
- [ ] Connected GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command to `npm install`
- [ ] Set start command to `npm start`
- [ ] Copied Backend Service ID (from URL: `srv-xxxxx`)
- [ ] Backend service deployed successfully
- [ ] Backend health endpoint accessible: `/health`

### Frontend Service
- [ ] Created Render Static Site
- [ ] Connected GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set build command to `npm install && npm run build`
- [ ] Set publish directory to `build`
- [ ] Added environment variable: `REACT_APP_API_URL` with backend URL
- [ ] Copied Frontend Service ID (from URL: `srv-xxxxx`)
- [ ] Frontend service deployed successfully

### Render API
- [ ] Created Render API Key
- [ ] Copied API Key securely

## ✅ GitHub Setup

- [ ] Repository exists on GitHub
- [ ] Code pushed to GitHub
- [ ] Added GitHub Secret: `RENDER_API_KEY`
- [ ] Added GitHub Secret: `RENDER_BACKEND_SERVICE_ID`
- [ ] Added GitHub Secret: `RENDER_FRONTEND_SERVICE_ID`
- [ ] All secrets verified (no typos)

## ✅ GitHub Actions

- [ ] Workflow file exists: `.github/workflows/ci-cd.yml`
- [ ] Pushed to `main` branch
- [ ] GitHub Actions workflow triggered
- [ ] Backend job completed successfully
- [ ] Frontend job completed successfully
- [ ] Deployment triggered on Render

## ✅ Verification

### Backend Verification
- [ ] Backend URL is accessible
- [ ] GET `/health` returns `{"status":"ok",...}`
- [ ] GET `/users` returns user array
- [ ] GET `/metrics` returns Prometheus metrics
- [ ] Logs visible in Render dashboard
- [ ] No errors in Render logs

### Frontend Verification
- [ ] Frontend URL is accessible
- [ ] Page loads without errors
- [ ] User list displays
- [ ] Can add new user
- [ ] Can edit existing user
- [ ] Can delete user
- [ ] No console errors in browser
- [ ] Frontend connects to backend successfully

## ✅ Post-Deployment

- [ ] Test full CRUD workflow on production
- [ ] Check observability metrics on `/metrics`
- [ ] Verify logs in Render dashboard
- [ ] Test after service "spins down" (wait 15+ min, then access)
- [ ] Document production URLs in README
- [ ] Share with team/stakeholders

## 🐛 If Something Fails

### Backend Issues
1. Check Render backend logs
2. Verify `package.json` has correct `start` script
3. Check all dependencies are in `dependencies` (not `devDependencies`)
4. Verify Node version compatibility

### Frontend Issues
1. Check Render frontend logs
2. Verify `REACT_APP_API_URL` is set correctly
3. Check `package.json` has correct `build` script
4. Verify no build errors

### CI/CD Issues
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Check Service IDs match Render services
4. Verify API key has proper permissions

### Connection Issues
1. Verify CORS is enabled in backend
2. Check backend URL in frontend env vars
3. Test backend endpoint directly with curl/Postman
4. Check browser console for CORS errors

## 📝 Production URLs Template

Fill in after deployment:

```
Backend:  https://_____________.onrender.com
Frontend: https://_____________.onrender.com

Health:   https://_____________.onrender.com/health
Metrics:  https://_____________.onrender.com/metrics
API:      https://_____________.onrender.com/users
```

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Both services are "Live" in Render dashboard
- ✅ Frontend loads and displays users
- ✅ Can perform all CRUD operations
- ✅ Backend metrics are accessible
- ✅ No errors in logs or console
- ✅ GitHub Actions shows green checkmarks

---

**Congratulations on your deployment! 🚀**
