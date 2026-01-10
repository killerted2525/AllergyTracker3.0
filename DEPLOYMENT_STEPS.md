# AllergyTracker - Complete Deployment Guide
## From Replit → GitHub → Render

Follow these exact steps to deploy your app to Render.

---

## PART 1: Create GitHub Repository

### Step 1: Go to GitHub
1. Open your browser and go to: **https://github.com/new**
2. Log in if needed

### Step 2: Create Repository
Fill out the form:
- **Repository name:** `allergytracker` (or any name you want)
- **Description:** (optional) "Food allergy tracking calendar app"
- **Visibility:** Choose **Private** or **Public** (your choice)
- **❌ DO NOT check** "Initialize with README"
- **❌ DO NOT check** "Add .gitignore"
- **❌ DO NOT check** "Choose a license"

Click **"Create repository"**

### Step 3: Copy Your Repository URL
GitHub will show you a page with commands. Copy the URL that looks like:
```
https://github.com/YOUR_USERNAME/allergytracker.git
```
Keep this page open - you'll need it!

---

## PART 2: Push Code from Replit to GitHub

### Step 4: Open Replit Shell
In your Replit project, click the **Shell** tab at the bottom.

### Step 5: Configure Git (First Time Only)
Copy and paste these commands ONE AT A TIME:

```bash
git config --global user.name "Your Name"
```

```bash
git config --global user.email "your.email@example.com"
```
(Use the same email as your GitHub account)

### Step 6: Initialize Git Repository
```bash
git init
```

### Step 7: Add All Files
```bash
git add .
```

### Step 8: Make First Commit
```bash
git commit -m "Initial commit - AllergyTracker ready for deployment"
```

### Step 9: Connect to GitHub
Replace `YOUR_USERNAME` with your actual GitHub username:
```bash
git remote add origin https://github.com/YOUR_USERNAME/allergytracker.git
```

### Step 10: Create GitHub Personal Access Token
You need this to push code to GitHub:

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Replit Deploy`
4. Check the box: **☑️ repo** (this checks all sub-boxes under it)
5. Scroll down and click **"Generate token"**
6. **COPY THE TOKEN** - you'll use this as your password! (It starts with `ghp_`)
7. Save it somewhere safe - you can't see it again!

### Step 11: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

When prompted:
- **Username:** Your GitHub username
- **Password:** Paste your Personal Access Token (NOT your GitHub password!)

✅ Your code is now on GitHub!

---

## PART 3: Set Up Neon Database

### Step 12: Create Neon Account
1. Go to: **https://neon.tech/**
2. Click **"Sign Up"** (use GitHub to sign up for easier login)
3. Complete the sign-up process

### Step 13: Create Database Project
1. Click **"Create a project"** or **"New Project"**
2. **Project name:** `allergytracker-production`
3. **Region:** Choose closest to you (e.g., US East, Europe, etc.)
4. Click **"Create Project"**

### Step 14: Get Database Connection String
1. On your project dashboard, look for **"Connection Details"** or **"Connection String"**
2. Make sure **"Pooled connection"** is selected
3. Copy the connection string - it looks like:
   ```
   postgresql://username:password@host.neon.tech/database?sslmode=require
   ```
4. **SAVE THIS** - you'll need it for Render!

---

## PART 4: Deploy to Render

### Step 15: Create Render Account
1. Go to: **https://render.com/**
2. Click **"Get Started"** or **"Sign Up"**
3. **Use "Sign up with GitHub"** - this makes connecting easier!
4. Authorize Render to access your GitHub account

### Step 16: Create New Web Service
1. In Render dashboard, click **"New +"** (top right)
2. Select **"Web Service"**

### Step 17: Connect Your Repository
1. Find **`allergytracker`** in the list (or search for it)
2. Click **"Connect"**

If you don't see it:
- Click **"Configure account"**
- Grant Render access to the repository
- Go back and try again

### Step 18: Configure Your Service

Fill out the form with these EXACT values:

**Basic Settings:**
- **Name:** `allergytracker` (or any name - this will be in your URL)
- **Region:** Choose closest to you (e.g., Oregon USA, Frankfurt, Singapore)
- **Branch:** `main`
- **Root Directory:** Leave blank
- **Runtime:** `Node`

**Build Settings:**
- **Build Command:**
  ```bash
  npm install && npm run build
  ```

- **Start Command:**
  ```bash
  npm run start
  ```

**Instance Type:**
- Choose **"Free"** (perfect for testing - spins down after inactivity)
- Or **"Starter ($7/month)"** (always on, faster)

### Step 19: Add Environment Variables

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** and add these THREE variables:

**Variable 1:**
- **Key:** `DATABASE_URL`
- **Value:** Your Neon connection string from Step 14
  ```
  postgresql://username:password@host.neon.tech/database?sslmode=require
  ```

**Variable 2:**
- **Key:** `SESSION_SECRET`
- **Value:** Generate a random secret by running this in Replit Shell:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Copy the output (a long random string) and paste it here

**Variable 3:**
- **Key:** `NODE_ENV`
- **Value:** `production`

### Step 20: Deploy!
Click **"Create Web Service"** at the bottom.

Render will now:
1. Clone your GitHub repository
2. Run `npm install && npm run build`
3. Start your server with `npm run start`

This takes 3-5 minutes.

---

## PART 5: Verify Deployment

### Step 21: Watch Build Logs
You'll see a build log that looks like:
```
==> Cloning from https://github.com/...
==> Running build command: npm install && npm run build
==> Build successful!
==> Starting server...
```

Wait for: **"Your service is live 🎉"**

### Step 22: Open Your App
At the top of the page, you'll see your URL:
```
https://allergytracker.onrender.com
```
(Or whatever name you chose)

Click it to open your app!

### Step 23: Test Your App
1. **Register** a new account
2. **Create a food** with "Every day" or "3 times per week"
3. **Export calendar** - download the .ics file
4. **Open in Apple Calendar** - verify events show on correct days

✅ **Your app is live!**

---

## PART 6: Update Your App Later

When you make changes in Replit:

### Step 24: Push Updates
```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

Render will automatically:
- Detect the push
- Rebuild your app
- Deploy the new version

No extra steps needed!

---

## Troubleshooting

### Problem: "git push" asks for password repeatedly
**Solution:** Use your Personal Access Token (from Step 10), NOT your GitHub password

### Problem: Build fails on Render
**Solution:** 
1. Check the build logs
2. Make sure all environment variables are set correctly
3. Verify your DATABASE_URL is correct

### Problem: App shows "Application Error"
**Solution:**
1. Click "Logs" in Render dashboard
2. Look for error messages
3. Common issues:
   - DATABASE_URL is wrong
   - SESSION_SECRET is missing
   - Database connection failed

### Problem: Can't see my repository in Render
**Solution:**
1. Go to Render dashboard
2. Account → Settings → GitHub
3. Click "Configure" and grant access to your repository

### Problem: Calendar export not working
**Solution:**
1. Make sure you pushed the latest code from Replit
2. Check that the app is using the latest build on Render
3. Clear your browser cache and try again

---

## Summary Checklist

Before you start, make sure you have:
- ✅ GitHub account
- ✅ Email access (for verifications)

After deployment, you should have:
- ✅ Code on GitHub
- ✅ Database on Neon
- ✅ App running on Render
- ✅ Public URL to share your app

**Your app URL will be:** `https://YOUR-APP-NAME.onrender.com`

---

## Need Help?

If something doesn't work:
1. Check the troubleshooting section above
2. Look at Render logs (Logs tab in dashboard)
3. Make sure all environment variables are set
4. Verify your GitHub repository has all the files

---

🎉 **Congratulations! Your AllergyTracker app is now deployed and accessible from anywhere!**
