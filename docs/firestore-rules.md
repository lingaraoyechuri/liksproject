# Firestore Security Rules

To enable the autosave functionality, you need to configure Firestore security rules in your Firebase Console.

## Required Rules

The application uses the following data path pattern:

```
/artifacts/{appId}/public/data/links/{pageId}
```

### Recommended Rules (With OAuth Claim Support)

For production use with OAuth claiming:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/links/{pageId} {
      // Public read access (anyone can view pages)
      // This allows both document reads and collection queries
      allow read: if true;

      // Allow authenticated users to create pages
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;

      // Allow users to update their own pages
      // Also allow claiming: anonymous user can transfer ownership to registered user
      allow update: if request.auth != null && (
        // Owner can update their own page
        request.resource.data.userId == request.auth.uid ||
        // Allow claiming: anonymous user transferring to registered user
        (
          resource.data.userId == request.auth.uid && // Current owner
          request.resource.data.userId != resource.data.userId && // Transferring ownership
          !resource.data.claimedAt // Not already claimed
        )
      );

      // Allow delete only by owner
      allow delete: if request.auth != null &&
                       resource.data.userId == request.auth.uid;
    }

    // Also allow queries on the collection itself (for slug lookups)
    match /artifacts/{appId}/public/data/links/{pageId=**} {
      allow read: if true;
    }
  }
}
```

**Important Notes:**

- The `allow read: if true;` rule allows both document reads and collection queries
- The second match pattern `{pageId=**}` allows queries on the collection itself
- Make sure to publish these rules in Firebase Console
- After updating rules, wait a few seconds for them to propagate

### More Permissive Rules (Development Only)

For quick testing during development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/links/{pageId} {
      // WARNING: This allows any authenticated user to read/write
      // Only use this for development!
      allow read, write: if request.auth != null;
    }
  }
}
```

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Paste the rules above
5. Click **Publish**

## Testing Rules

After applying rules, test them using the Firebase Console's Rules Playground or by testing the application directly.
