# Testing Guide - Local Development

This guide explains how to test the public page component and path-based routing locally.

## Quick Start

1. **Start the development server:**

   ```bash
   yarn dev
   ```

2. **Access the app:**
   - Main app: http://localhost:3000
   - Public page (by slug): http://localhost:3000/mynewusername
   - Public page (by pageId): http://localhost:3000/Cgsgua77RFNq2Jwn2ZQlkaHRM7D2

## Testing Methods

### Method 1: Direct Route Testing (Easiest)

You can test the public page directly using the path-based route:

**Test with slug:**

```
http://localhost:3000/mynewusername
```

**Test with pageId (fallback):**

```
http://localhost:3000/Cgsgua77RFNq2Jwn2ZQlkaHRM7D2
```

The component will:

1. First try to find the page by `slug` in Firestore
2. If not found, fall back to finding by `pageId`
3. Display the page with profile data, links, layout, and theme

### Method 2: Path-Based Routing (Current Implementation)

The application now uses path-based routing (`linkstudio.me/username`) instead of subdomain routing. This means:

- **No special configuration needed** - works directly with `localhost:3000`
- **Simple URL format**: `http://localhost:3000/username`
- **No DNS or hosts file changes required**
- **Easier to test and deploy**

## Testing Checklist

### ✅ Basic Functionality

- [ ] **Page loads with slug**: `http://localhost:3000/mynewusername`
- [ ] **Page loads with pageId**: `http://localhost:3000/Cgsgua77RFNq2Jwn2ZQlkaHRM7D2`
- [ ] **Loading state displays** while fetching data
- [ ] **Error state displays** for invalid/non-existent pages

### ✅ Profile Data Display

- [ ] **Profile picture** displays (if provided)
- [ ] **Display name** shows correctly
- [ ] **Bio** displays correctly
- [ ] **Fallback to placeholders** when data is missing

### ✅ Layout Rendering

- [ ] **Correct layout** is rendered based on `layoutId`
- [ ] **All 10 layouts** can be tested:
  - `creator-classic`
  - `photographer-portfolio`
  - `small-business-showcase`
  - `influencer-product-hub`
  - `video-creator-focus`
  - `premium-creator`
  - `minimalist-professional`
  - `artist-musician`
  - `retro-aesthetic`
  - `modern-business-card`

### ✅ Theme Application

- [ ] **Theme colors** apply correctly
- [ ] **Background color** matches theme
- [ ] **Primary/secondary colors** used in links/buttons

### ✅ Links Display

- [ ] **All links** are displayed
- [ ] **Link text** shows correctly
- [ ] **Links are clickable** and open in new tab
- [ ] **Click tracking** works (check console logs)

### ✅ Real-Time Updates

- [ ] **Changes in Firebase** reflect immediately
- [ ] **Profile updates** appear without refresh
- [ ] **Link updates** appear without refresh
- [ ] **Theme changes** appear without refresh

## Test Data Setup

### Create Test Page in Firebase

1. Go to Firebase Console → Firestore Database
2. Navigate to: `artifacts/{YOUR_APP_ID}/public/data/links`
3. Create a new document with this structure:

```json
{
  "pageId": "test-page-123",
  "userId": "test-user-123",
  "slug": "mynewusername",
  "username": "mynewusername",
  "layoutId": "creator-classic",
  "themeId": "light-orange",
  "profileData": {
    "name": "Test User",
    "bio": "This is a test bio",
    "profilePic": "https://via.placeholder.com/150"
  },
  "links": [
    {
      "id": "platform-instagram",
      "text": "Instagram",
      "url": "https://instagram.com/test",
      "isSpotlight": false,
      "clickCount": 0
    },
    {
      "id": "platform-youtube",
      "text": "YouTube",
      "url": "https://youtube.com/@test",
      "isSpotlight": false,
      "clickCount": 0
    }
  ],
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### Test Different Scenarios

1. **Page with all data:**

   - Profile picture, name, bio
   - Multiple links
   - Custom theme
   - Custom layout

2. **Page with minimal data:**

   - No profile picture
   - No bio
   - Only username
   - Default theme and layout

3. **Page with different layouts:**

   - Test each of the 10 layouts
   - Verify profile data displays correctly in each

4. **Page with different themes:**
   - Test all 6 themes
   - Verify colors apply correctly

## Debugging Tips

### Check Browser Console

Look for these logs:

- `🔵 ShareableUrlDisplay initialized with slug: ...`
- `📡 Real-time update received: ...`
- `Link clicked in public view: ...`

### Check Network Tab

- Verify Firestore queries are successful
- Check for permission errors
- Verify real-time listener is active

### Common Issues

1. **"Page not found" error:**

   - Check if `slug` or `pageId` exists in Firestore
   - Verify Firestore security rules allow public read access
   - Check collection path matches your Firebase app ID

2. **Profile data not displaying:**

   - Verify `profileData` field exists in Firestore document
   - Check that `profileData` is passed to `LinkPreview` component
   - Verify layout component accepts `profileData` prop

3. **Layout not rendering:**

   - Check `layoutId` matches one of the 10 available layouts
   - Verify layout component is imported in `LinkPreview.tsx`
   - Check for console errors

4. **Theme not applying:**
   - Verify `themeId` exists in `THEMES` array
   - Check that theme colors are passed to layout components

## Production Testing

Once deployed, test with actual path-based URL:

```
https://linkstudio.me/mynewusername
```

The public page component will handle the lookup directly from the path.

## Next Steps

After testing locally:

1. Deploy to staging/production
2. Test subdomain routing in production
3. Verify Firestore security rules
4. Test with real user data
5. Monitor for errors in production logs
