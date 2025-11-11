# Quick Deployment Guide - LinkStudio

## Fast Track to Production

### Prerequisites Checklist

- [ ] Firebase project created
- [ ] Git repository (GitHub/GitLab/Bitbucket)
- [ ] Domain name (optional)

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Prepare Firebase

1. **Get your Firebase config:**

   - Firebase Console → Project Settings → General
   - Copy all `NEXT_PUBLIC_FIREBASE_*` values

2. **Enable Auth providers:**

   - Authentication → Sign-in method
   - Enable Google (add OAuth credentials)
   - Enable Facebook (add App ID/Secret)

3. **Deploy Firestore rules:**
   - Firestore Database → Rules
   - Copy rules from `docs/firestore-rules.md`
   - Publish

### Step 2: Deploy to Vercel

**Option A: Via Web Interface (Easiest)**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next` (default)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
6. Click **"Deploy"**

**Option B: Via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? linkstudio
# - Directory? ./
# - Override settings? N
```

### Step 3: Add Custom Domain (Optional)

1. In Vercel dashboard → **Settings** → **Domains**
2. Add your domain: `linkstudio.me`
3. Update DNS records as instructed by Vercel
4. Add domain to Firebase **Authorized domains**

### Step 4: Test

1. Visit your deployed URL
2. Test sign-in/sign-up
3. Create a test page
4. Access public page: `https://your-domain.com/test-username`

---

## 🔧 Environment Variables Template

Create these in your deployment platform:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## ✅ Post-Deployment Checklist

- [ ] Application loads at production URL
- [ ] Sign in with Google works
- [ ] Sign in with Facebook works
- [ ] Can create a page
- [ ] Public page accessible: `https://your-domain.com/username`
- [ ] Mobile responsive
- [ ] No console errors

---

## 🐛 Common Issues

**Build fails:**

- Check Node.js version (needs 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

**Auth not working:**

- Verify environment variables are set
- Check Firebase Authorized domains
- Verify OAuth providers are enabled

**404 on public pages:**

- Check Firestore security rules
- Verify slug/pageId exists in database
- Check route format: `/username` not `/p/username`

---

## 📚 Full Documentation

See `docs/deployment-guide.md` for detailed instructions.

---

**Need help?** Check the troubleshooting section in the full deployment guide.
