# 🚀 SafeSpace Salone - Complete Setup Guide

This guide will walk you through setting up SafeSpace Salone from scratch. Follow each step carefully for a smooth installation.

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Configuration](#database-configuration)
4. [Authentication Setup](#authentication-setup)
5. [Environment Variables](#environment-variables)
6. [Database Migration](#database-migration)
7. [Seed Demo Data](#seed-demo-data)
8. [Running the Application](#running-the-application)
9. [Testing Features](#testing-features)
10. [Production Deployment](#production-deployment)
11. [Troubleshooting](#troubleshooting)

---

## 📦 **Prerequisites**

Before you begin, ensure you have the following installed:

### **Required Software**

| Software | Version | Download Link |
|----------|---------|---------------|
| Node.js | 18.0.0+ | [nodejs.org](https://nodejs.org) |
| pnpm | 8.0.0+ | [pnpm.io](https://pnpm.io/installation) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### **Required Accounts**

| Service | Purpose | Sign Up Link |
|---------|---------|--------------|
| Neon | PostgreSQL Database | [console.neon.tech](https://console.neon.tech) |
| Clerk | Authentication | [dashboard.clerk.com](https://dashboard.clerk.com) |
| Vercel (Optional) | Deployment | [vercel.com](https://vercel.com) |

### **Verify Installation**

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check pnpm version
pnpm --version  # Should be 8.0.0 or higher

# Check Git version
git --version
```

---

## 🔧 **Initial Setup**

### **Step 1: Clone the Repository**

```bash
# Clone via HTTPS
git clone https://github.com/walon-foundation/safespace-salone.git

# OR clone via SSH
git clone git@github.com:walon-foundation/safespace-salone.git

# Navigate to project directory
cd safespace-salone
```

### **Step 2: Install Dependencies**

```bash
# Install all dependencies
pnpm install

# This will install:
# - Next.js 16
# - React 19
# - Drizzle ORM
# - Clerk
# - Tailwind CSS
# - And all other dependencies
```

**Expected output:**
```
Packages: +279
Progress: resolved 279, reused 0, downloaded 279, added 279
Done in 45.2s
```

---

## 🗄️ **Database Configuration**

### **Step 1: Create Neon Database**

1. Go to [console.neon.tech](https://console.neon.tech)
2. Click **"Sign Up"** (use GitHub for quick signup)
3. Click **"Create Project"**
4. Fill in project details:
   - **Project Name:** SafeSpace Salone
   - **Region:** Choose closest to Sierra Leone (e.g., EU West)
   - **PostgreSQL Version:** 16 (latest)
5. Click **"Create Project"**

### **Step 2: Get Connection String**

1. In your Neon dashboard, click on your project
2. Go to **"Connection Details"**
3. Copy the connection string (it looks like this):

```
postgresql://neondb_owner:npg_ABC123XYZ@ep-cool-name-123456.eu-west-1.aws.neon.tech/neondb?sslmode=require
```

4. **Save this** - you'll need it in the next step

### **Step 3: Test Database Connection**

```bash
# Install psql (PostgreSQL client) if you don't have it
# macOS:
brew install postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql-client

# Test connection
psql "postgresql://your-connection-string-here"

# You should see:
# psql (16.x)
# SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256)
# Type "help" for help.
# neondb=>
```

Type `\q` to exit.

---

## 🔐 **Authentication Setup**

### **Step 1: Create Clerk Application**

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Click **"Sign Up"** (use GitHub/Google)
3. Click **"+ Create Application"**
4. Fill in application details:
   - **Application Name:** SafeSpace Salone
   - **Sign-in Options:** Enable Email + Google + GitHub
5. Click **"Create Application"**

### **Step 2: Get API Keys**

1. In your Clerk dashboard, go to **"API Keys"** (left sidebar)
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)
3. Click **"Copy"** for each key
4. **Save these** - you'll need them next

### **Step 3: Configure Clerk URLs**

1. In Clerk dashboard, go to **"Paths"**
2. Set the following:
   - **Sign-in URL:** `/counselor/sign-in`
   - **Sign-up URL:** `/counselor/sign-up`
   - **After sign-in:** `/counselor/dashboard`
   - **After sign-up:** `/counselor/dashboard`
3. Click **"Save"**

---

## 🔑 **Environment Variables**

### **Step 1: Create Environment File**

```bash
# Copy the example file
cp .env.local.example .env.local

# Open in your editor
nano .env.local  # or use your preferred editor
```

### **Step 2: Fill in Variables**

```bash
# ============================================
# DATABASE (Neon)
# ============================================
DATABASE_URL=postgresql://neondb_owner:npg_ABC123@ep-...neon.tech/neondb?sslmode=require

# ============================================
# CLERK AUTHENTICATION
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZXhhbXBsZS5jb20k
CLERK_SECRET_KEY=sk_test_1234567890abcdefghijklmnopqrstuvwxyz

# Clerk URLs (these should match your Clerk dashboard settings)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/counselor/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/counselor/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/counselor/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/counselor/dashboard

# ============================================
# OPTIONAL CONFIGURATION
# ============================================
# Audio storage (default is local filesystem)
NEXT_PUBLIC_AUDIO_STORAGE_URL=/api/audio

# Rate limiting (optional, defaults shown)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# CORS origins (add your production domain)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### **Step 3: Verify Environment Variables**

```bash
# Check if .env.local exists and has content
cat .env.local | grep DATABASE_URL
cat .env.local | grep CLERK_SECRET_KEY

# Should show your actual values (not the examples)
```

---

## 🔄 **Database Migration**

### **Step 1: Push Schema to Database**

```bash
# This creates all tables in your Neon database
pnpm db:push
```

**Expected output:**
```
✔ Applying SQL statements
✔ Done!

Tables created:
  - users
  - conversations
  - messages
  - assignment_requests
```

### **Step 2: Verify Tables**

```bash
# Open Drizzle Studio (visual database browser)
pnpm db:studio
```

This opens [https://local.drizzle.studio](https://local.drizzle.studio) in your browser.

You should see 4 tables:
- `users`
- `conversations`
- `messages`
- `assignment_requests`

---

## 🌱 **Seed Demo Data**

### **Step 1: Run Seed Script**

```bash
# This creates 4 demo counselors
pnpm db:seed
```

**Expected output:**
```
🌱 Seeding database...
✅ Created 4 counselors:
   - Counselor Hope (counselor)
   - Dr. Sarah (counselor)
   - Counselor James (counselor)
   - Dr. Amina (doctor)

🎉 Seeding complete!

You can now:
  1. Sign up as a user at http://localhost:3000/signup
  2. Access counselor dashboard at http://localhost:3000/counselor/dashboard
  3. View database in Drizzle Studio: pnpm db:studio
```

### **Step 2: Verify Seed Data**

```bash
# Open Drizzle Studio
pnpm db:studio

# Navigate to 'users' table
# You should see 4 counselors
```

---

## 🚀 **Running the Application**

### **Development Mode**

```bash
# Start development server
pnpm dev
```

**Expected output:**
```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Production Build**

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

**Note:** PWA features (service worker) only work in production mode.

---

## 🧪 **Testing Features**

### **Test 1: Anonymous User Flow**

1. Go to `http://localhost:3000`
2. Click **"Get Started Anonymously"**
3. Complete signup:
   - Choose avatar
   - Enter username (e.g., "TestUser123")
   - Select topics (e.g., Anxiety, Depression)
   - Create 4-6 digit PIN
4. You'll be redirected to chat
5. Send a text message
6. Send a voice note (click microphone, record, send)

**Expected:** Messages appear in chat, voice note plays back.

### **Test 2: Emergency SOS**

1. On landing page, click **"🆘 Emergency Help"** (top right)
2. Confirm you need help
3. See crisis hotlines with click-to-call

**Expected:** Modal shows with emergency numbers.

### **Test 3: Crisis Detection**

1. In chat, type: "I want to end it all"
2. Send message

**Expected:** System detects crisis keywords, shows emergency resources.

### **Test 4: Mood Tracking**

1. Complete signup (if not done)
2. Rate your mood before chat
3. Chat for a bit
4. Rate your mood after

**Expected:** Mood improvement tracked.

### **Test 5: Language Switcher**

1. On landing page, click language switcher (top right)
2. Select **"Krio"**
3. UI changes to Krio language

**Expected:** Text changes to Sierra Leone Creole.

### **Test 6: Counselor Dashboard**

1. Go to `http://localhost:3000/counselor/dashboard`
2. You'll be redirected to sign-in
3. Click **"Sign Up"**
4. Create counselor account with email
5. Access dashboard

**Expected:** See conversations, stats, assignment requests.

### **Test 7: Impact Dashboard**

1. Go to `http://localhost:3000/impact`
2. View live metrics

**Expected:** See animated stats (127 users, 78% improvement, etc.).

---

## 🌐 **Production Deployment**

### **Deploy to Vercel (Recommended)**

#### **Step 1: Push to GitHub**

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository
# Then push
git remote add origin https://github.com/yourusername/safespace-salone.git
git push -u origin main
```

#### **Step 2: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `pnpm build`
   - **Output Directory:** .next

#### **Step 3: Add Environment Variables**

In Vercel dashboard, go to **Settings** → **Environment Variables**

Add all variables from your `.env.local`:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- All other Clerk variables

#### **Step 4: Deploy**

1. Click **"Deploy"**
2. Wait for build to complete (~2 minutes)
3. Your app is live! 🎉

#### **Step 5: Update Clerk Production URLs**

1. In Clerk dashboard, go to **"Domains"**
2. Add your Vercel domain (e.g., `safespace-salone.vercel.app`)
3. Update redirect URLs to use production domain

---

## 🐛 **Troubleshooting**

### **Issue: Database Connection Error**

**Error:**
```
Error: getaddrinfo ENOTFOUND
```

**Solution:**
1. Check `DATABASE_URL` in `.env.local`
2. Ensure no extra spaces or quotes
3. Verify Neon database is active
4. Test connection with `psql`

### **Issue: Clerk Not Working**

**Error:**
```
Clerk: Missing publishableKey
```

**Solution:**
1. Check `.env.local` has `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. Restart dev server (`pnpm dev`)
3. Clear browser cache
4. Verify keys in Clerk dashboard

### **Issue: Audio Not Recording**

**Error:**
```
MediaRecorder is not defined
```

**Solution:**
1. Audio only works on `localhost` or HTTPS
2. Grant microphone permissions in browser
3. Use Chrome/Edge (best support)
4. For production, deploy to Vercel (automatic HTTPS)

### **Issue: PWA Not Installing**

**Solution:**
1. PWA only works in production build
2. Run `pnpm build && pnpm start`
3. Visit `http://localhost:3000`
4. Look for install prompt

### **Issue: TypeScript Errors**

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Restart dev server
pnpm dev
```

### **Issue: Rate Limiting Too Strict**

**Solution:**
Edit `proxy.ts`:
```typescript
const RATE_LIMIT = {
  maxRequests: 200, // Increase from 100
  windowMs: 15 * 60 * 1000,
};
```

---

## 📚 **Next Steps**

After successful setup:

1. **Customize Branding**
   - Update colors in `tailwind.config.ts`
   - Replace logo in `public/icons/`
   - Update crisis hotlines in `src/utils/crisis-detection.ts`

2. **Add Real Counselors**
   - Invite counselors via Clerk dashboard
   - Assign roles in database
   - Configure specialties

3. **Configure Production**
   - Update `ALLOWED_ORIGINS` in `proxy.ts`
   - Set up monitoring (Sentry, LogRocket)
   - Enable analytics
   - Configure CDN

4. **Security Hardening**
   - Review `SECURITY.md`
   - Run `pnpm audit`
   - Set up WAF (Cloudflare)
   - Enable database backups

---

## 📞 **Get Help**

- **Documentation:** [README.md](README.md)
- **Security:** [SECURITY.md](SECURITY.md)
- **Issues:** [GitHub Issues](https://github.com/walon-foundation/safespace-salone/issues)
- **Email:** team@safespacesalone.org

---

## ✅ **Setup Checklist**

Use this checklist to track your progress:

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Repository cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] Neon database created
- [ ] Clerk application created
- [ ] `.env.local` configured
- [ ] Database schema pushed (`pnpm db:push`)
- [ ] Demo data seeded (`pnpm db:seed`)
- [ ] Dev server running (`pnpm dev`)
- [ ] User signup tested
- [ ] Counselor dashboard tested
- [ ] All features working
- [ ] Production deployment (optional)

