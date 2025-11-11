# Deployment Guide - LinkStudio

This guide will walk you through deploying LinkStudio to production.

## Prerequisites

- ✅ Firebase project set up with Authentication and Firestore
- ✅ Environment variables configured
- ✅ Domain name (optional, but recommended)
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Firebase Project

### 1.1 Verify Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **General**
4. Note your Firebase configuration values

### 1.2 Enable Authentication Methods

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider:
   - Add OAuth client IDs from Google Cloud Console
   - Add authorized domains (your production domain)
3. Enable **Facebook** provider:
   - Add App ID and App Secret from Facebook Developers
   - Add authorized domains

### 1.3 Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Deploy the security rules from `docs/firestore-rules.md`
3. Test the rules to ensure they work correctly

### 1.4 Add Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain (e.g., `linkstudio.me`)
3. Remove `localhost` if you don't need it in production

## Step 2: Prepare Environment Variables

Create a `.env.production` file (or use your deployment platform's environment variable settings):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**⚠️ Important:** Never commit `.env.production` to Git. Add it to `.gitignore`.

## Step 3: Build and Test Locally

Before deploying, test the production build locally:

```bash
# Install dependencies
yarn install

# Build the application
yarn build

# Test the production build
yarn start
```

Visit `http://localhost:3000` and verify:

- ✅ Application loads correctly
- ✅ Firebase connection works
- ✅ Authentication works
- ✅ Public pages are accessible (e.g., `http://localhost:3000/test-username`)

## Step 4: Choose a Deployment Platform

### Option A: Vercel (Recommended for Next.js)

Vercel is the recommended platform for Next.js applications.

#### 4.1 Deploy to Vercel

1. **Install Vercel CLI** (optional, or use web interface):

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

   Or use the web interface:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure environment variables
   - Deploy

#### 4.2 Configure Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all Firebase environment variables:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. Set them for **Production**, **Preview**, and **Development** environments

#### 4.3 Configure Build Settings

Vercel should auto-detect Next.js, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `yarn build` (or `npm run build`)
- **Output Directory**: `.next` (default)
- **Install Command**: `yarn install` (or `npm install`)

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Configure build settings:
   - **Build command**: `yarn build`
   - **Publish directory**: `.next`
5. Add environment variables in **Site settings** → **Environment variables**

### Option C: Self-Hosted (VPS/Server)

If deploying to your own server:

1. **Build the application**:

   ```bash
   yarn build
   ```

2. **Start the production server**:

   ```bash
   yarn start
   ```

3. **Use a process manager** (PM2 recommended):

   ```bash
   npm install -g pm2
   pm2 start yarn --name linkstudio -- start
   pm2 save
   pm2 startup
   ```

4. **Set up reverse proxy** (Nginx recommended):

   ```nginx
   server {
       listen 80;
       server_name linkstudio.me;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set up SSL** (Let's Encrypt recommended):
   ```bash
   sudo certbot --nginx -d linkstudio.me
   ```

## Step 5: Configure Custom Domain

### 5.1 Add Domain to Vercel

1. Go to **Settings** → **Domains**
2. Add your domain: `linkstudio.me`
3. Follow DNS configuration instructions

### 5.2 Configure DNS Records

Add these DNS records to your domain provider:

**For Vercel:**

- **Type**: A
- **Name**: @
- **Value**: `76.76.21.21` (Vercel's IP)

- **Type**: CNAME
- **Name**: www
- **Value**: `cname.vercel-dns.com`

**For other platforms**, follow their DNS configuration guide.

### 5.3 Update Firebase Authorized Domains

1. Go to Firebase Console → **Authentication** → **Settings**
2. Add your production domain to **Authorized domains**
3. Add `www.linkstudio.me` if using www subdomain

## Step 6: Post-Deployment Checklist

### 6.1 Test Authentication

- [ ] Sign in with Google works
- [ ] Sign in with Facebook works
- [ ] Sign out works
- [ ] User avatar displays correctly

### 6.2 Test Public Pages

- [ ] Create a test page with username
- [ ] Access public page: `https://linkstudio.me/test-username`
- [ ] Verify profile data displays
- [ ] Verify links work
- [ ] Verify layout renders correctly
- [ ] Verify theme applies

### 6.3 Test Core Features

- [ ] Landing page loads
- [ ] User can create a page
- [ ] User can add links
- [ ] User can select layout
- [ ] User can edit profile information
- [ ] Data saves to Firebase
- [ ] Real-time updates work

### 6.4 Test Mobile Responsiveness

- [ ] Test on mobile device
- [ ] Verify layouts display correctly
- [ ] Verify header is responsive
- [ ] Verify URL display works on mobile

### 6.5 Performance Check

- [ ] Page load time is acceptable
- [ ] Images load correctly
- [ ] No console errors
- [ ] Firebase queries are efficient

## Step 7: Monitor and Maintain

### 7.1 Set Up Monitoring

- **Vercel Analytics**: Enable in Vercel dashboard
- **Firebase Performance**: Enable in Firebase Console
- **Error Tracking**: Consider Sentry or similar

### 7.2 Set Up Logging

Monitor:

- Firebase Authentication errors
- Firestore read/write errors
- Application errors in browser console

### 7.3 Regular Backups

- **Firestore**: Set up automated backups in Firebase Console
- **Code**: Ensure Git repository is up to date

## Troubleshooting

### Issue: Authentication not working

**Solution:**

1. Verify environment variables are set correctly
2. Check Firebase Authorized domains
3. Verify OAuth providers are enabled
4. Check browser console for errors

### Issue: Public pages return 404

**Solution:**

1. Verify Firestore security rules allow public read access
2. Check that `slug` or `pageId` exists in Firestore
3. Verify the route is correct: `/username` not `/p/username`

### Issue: Build fails

**Solution:**

1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version is compatible (18+)
4. Clear `.next` folder and rebuild

### Issue: Environment variables not working

**Solution:**

1. Verify variables are prefixed with `NEXT_PUBLIC_`
2. Restart the deployment after adding variables
3. Check variable names match exactly (case-sensitive)

## Quick Deployment Checklist

- [ ] Firebase project configured
- [ ] Environment variables set
- [ ] Application builds successfully locally
- [ ] Git repository is up to date
- [ ] Deployed to hosting platform
- [ ] Environment variables added to hosting platform
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] Firebase authorized domains updated
- [ ] Tested authentication
- [ ] Tested public pages
- [ ] Tested on mobile
- [ ] Monitoring set up

## Next Steps After Deployment

1. **Share your application**: `https://linkstudio.me`
2. **Create a test page**: Verify end-to-end flow
3. **Monitor usage**: Check Firebase Console for activity
4. **Gather feedback**: Test with real users
5. **Iterate**: Make improvements based on feedback

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Firebase Console for authentication/Firestore errors
3. Review deployment logs
4. Check this guide's troubleshooting section

---

**Congratulations!** Your LinkStudio application is now live! 🎉
