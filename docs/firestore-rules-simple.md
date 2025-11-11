# Simple Firestore Rules (Quick Fix)

If you're getting "Missing or insufficient permissions" errors, use these simplified rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to all link pages
    match /artifacts/{appId}/public/data/links/{pageId} {
      // Anyone can read (view pages)
      allow read: if true;
      
      // Only authenticated users can write
      allow write: if request.auth != null;
    }
  }
}
```

**To apply:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Paste the rules above
5. Click **Publish**
6. Wait 10-30 seconds for rules to propagate

**Note:** These rules are permissive for development. Use the more restrictive rules in `firestore-rules.md` for production.

