# AllergyTracker - Render Deployment Guide

## Complete Step-by-Step Instructions

### Part 1: Prepare Your GitHub Repository

#### 1.1 Create a New GitHub Repository
1. Go to https://github.com/new
2. Name it: `allergytracker` (or your preferred name)
3. Make it **Private** or **Public** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

#### 1.2 Initialize Git in Replit (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - AllergyTracker ready for deployment"
```

#### 1.3 Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/allergytracker.git
git branch -M main
git push -u origin main
```

**Note:** You'll need a GitHub Personal Access Token for authentication:
- Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token with `repo` permissions
- Use this token as your password when pushing

---

### Part 2: Set Up Neon PostgreSQL Database

#### 2.1 Create Neon Account
1. Go to https://neon.tech/
2. Sign up for free account (supports PostgreSQL)
3. Create a new project: "AllergyTracker Production"

#### 2.2 Get Database Connection String
1. In Neon dashboard, go to your project
2. Click "Connection Details"
3. Copy the **Connection String** (looks like: `postgresql://username:password@host/database?sslmode=require`)
4. **Save this** - you'll need it for Render

---

### Part 3: Deploy to Render

#### 3.1 Create Render Account
1. Go to https://render.com/
2. Sign up (use GitHub to connect)
3. Authorize Render to access your repositories

#### 3.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `allergytracker`
3. Click "Connect"

#### 3.3 Configure Build Settings

**Name:** `allergytracker` (or your preferred name)

**Region:** Choose closest to you (e.g., Oregon USA)

**Branch:** `main`

**Root Directory:** Leave blank

**Runtime:** `Node`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

#### 3.4 Set Environment Variables

Click "Advanced" → Add Environment Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://username:password@host/database?sslmode=require` | **From Neon dashboard** |
| `SESSION_SECRET` | `your-super-secret-random-string-here-make-it-long-and-random` | **Generate a random string** (at least 32 characters) |
| `NODE_ENV` | `production` | Required for production mode |

**How to Generate SESSION_SECRET:**
Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3.5 Choose Plan
- **Free Plan**: Perfect for testing (spins down after inactivity)
- **Starter Plan** ($7/month): Always on, better for production

#### 3.6 Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Clone your GitHub repo
   - Run `npm install && npm run build`
   - Run database migrations
   - Start your app with `npm run start`

---

### Part 4: Verify Deployment

#### 4.1 Check Build Logs
1. In Render dashboard, click on your service
2. Go to "Logs" tab
3. Wait for: `✅ Build successful` and `Server running on port XXXX`

#### 4.2 Test Your App
1. Click the URL at top of Render dashboard (e.g., `https://allergytracker.onrender.com`)
2. Register a new user account
3. Create a test food with "Every day" frequency
4. Export calendar and verify:
   - ICS file downloads
   - Open in Apple Calendar
   - Events repeat on multiple days ✅

---

### Part 5: Updating Your App

When you make changes to your code:

```bash
# Make your changes in Replit
git add .
git commit -m "Description of changes"
git push origin main
```

**Render will automatically:**
- Detect the push
- Rebuild your app
- Redeploy with zero downtime

---

## Environment Variables Reference

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string from Neon
- `SESSION_SECRET` - Random secret for session encryption
- `NODE_ENV=production` - Enables production mode

### Database Schema
Your app uses Drizzle ORM. Migrations run automatically on deploy via:
```bash
npm run db:push
```

This is handled in your `package.json` build script.

---

## Troubleshooting

### Issue: "Build failed"
**Fix:** Check Render logs for specific error. Common issues:
- Missing environment variables
- Node version mismatch
- Database connection failed

### Issue: "Application error"
**Fix:** 
1. Check Render logs for error messages
2. Verify `DATABASE_URL` is correct
3. Verify `SESSION_SECRET` is set

### Issue: Calendar export not working
**Fix:**
- Verify you're using latest code from GitHub
- Check browser console for errors
- Verify timezone setting (should be America/New_York)

### Issue: Database connection error
**Fix:**
1. Verify Neon database is running
2. Check DATABASE_URL includes `?sslmode=require`
3. Whitelist Render IP in Neon (if required)

---

## Build Commands Explained

**Build Command:** `npm install && npm run build`
- Installs all dependencies
- Compiles TypeScript frontend (Vite)
- Bundles backend (ESBuild)
- Runs database migrations

**Start Command:** `npm run start`
- Starts Express server on Render's assigned port
- Serves static frontend from `dist/public`
- Handles API routes

---

## Quick Reference

### File Structure After Build
```
dist/
  ├── public/          # Frontend static files (Vite build)
  ├── server.js        # Backend bundle (ESBuild)
  └── server.js.map    # Source map
```

### Important URLs
- **Render Dashboard:** https://dashboard.render.com/
- **Neon Dashboard:** https://console.neon.tech/
- **Your App:** https://YOUR-APP-NAME.onrender.com

### Support
If you encounter issues:
1. Check Render logs first
2. Verify all environment variables
3. Test database connection
4. Check GitHub repository is up to date

---

## Success Checklist

- [ ] GitHub repository created and code pushed
- [ ] Neon PostgreSQL database created
- [ ] Render web service created
- [ ] All environment variables set correctly
- [ ] Build completed successfully
- [ ] App accessible at Render URL
- [ ] User registration working
- [ ] Food creation working
- [ ] Calendar export working with recurring events
- [ ] Events showing on correct days in Apple Calendar

**You're all set! Your app is now live on Render!** 🎉
