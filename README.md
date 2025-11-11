# LinkStudio

A modern, zero-friction link-in-bio application built with Next.js, Firebase, TypeScript, and Styled Components.

## Features

- **Zero-Friction Entry**: Start creating your link page instantly without signing up
- **OAuth Claiming**: Claim your page permanently with Google or Facebook sign-in
- **Real-Time Sync**: Changes autosave automatically with Firebase Firestore
- **Custom URLs**: Create your own custom URL slug (e.g., `yoursite.com/your-username`)
- **Theme Selection**: Choose from multiple beautiful themes
- **Mobile Preview**: See how your page looks on mobile devices
- **Anonymous to Registered**: Seamlessly convert anonymous accounts to permanent ones

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Styled Components
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn installed
- Firebase project with:
  - Anonymous Authentication enabled
  - Google OAuth provider enabled (for claiming)
  - Facebook OAuth provider enabled (for claiming)
  - Firestore Database initialized

### Installation

1. Clone the repository and install dependencies:

```bash
yarn install
```

2. Create a `.env.local` file in the root directory with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Enable Firebase Authentication methods:

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to **Authentication** → **Sign-in method**
   - Enable **Anonymous** authentication
   - Enable **Google** provider (add OAuth client IDs)
   - Enable **Facebook** provider (add App ID and App Secret)

4. Set up Firestore Security Rules:

   See `docs/firestore-rules.md` for recommended security rules.

5. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### User Flow

1. **Anonymous Creation**: Users can create a page immediately without signing up
2. **Edit & Customize**: Add links, choose themes, set custom URL
3. **Claim Page**: Click "Claim & Save This Page!" to permanently own the page
4. **OAuth Sign-In**: Sign in with Google or Facebook to claim ownership
5. **Permanent Access**: Page is now linked to your account - access from any device

### Security

- Anonymous users can only edit their own pages (matched by `userId`)
- Public pages are readable by anyone
- Only the owner can update/delete their page
- OAuth claiming transfers ownership securely

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── [pageId]/          # Public page view
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── App.tsx           # Main app component
│   ├── LinkEditor.tsx    # Link editing interface
│   ├── LinkPreview.tsx   # Mobile preview
│   ├── LandingPage.tsx   # Landing page
│   ├── Header.tsx        # App header
│   └── ClaimPageModal.tsx # OAuth claim modal
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   └── useLinkPage.ts    # Page data management
├── lib/                  # Utilities and config
│   ├── firebase/         # Firebase configuration
│   ├── theme/            # Theme constants
│   └── utils/             # Helper functions
└── types/                # TypeScript type definitions
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Firebase Setup

### Enable Anonymous Authentication

1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Anonymous"
3. Enable it and save

### Enable OAuth Providers

#### Google

1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Google"
3. Enable it
4. Add your OAuth client IDs (from Google Cloud Console)

#### Facebook

1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Facebook"
3. Enable it
4. Add your App ID and App Secret (from Facebook Developers)

### Firestore Rules

See `docs/firestore-rules.md` for complete security rules that support:

- Public page viewing
- Anonymous page creation
- OAuth claiming
- Owner-only editing

## License

MIT
