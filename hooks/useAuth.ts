'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  signInAnonymously, 
  signInWithCustomToken,
  signInWithPopup,
  linkWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Firebase auth is initialized
    if (!auth) {
      setError('Firebase is not configured. Please set up your Firebase credentials.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        setError(null);
      } else {
        // Don't automatically sign in - user must authenticate manually
        // Check for initial auth token from global variable or environment
        const initialAuthToken = 
          typeof window !== 'undefined' 
            ? (window as any).__initial_auth_token 
            : null;

        if (initialAuthToken && auth) {
          try {
            // Sign in with custom token if available
            await signInWithCustomToken(auth, initialAuthToken);
          } catch (error: any) {
            console.error('Authentication error:', error);
            setError(error?.message || 'Failed to authenticate');
            setLoading(false);
          }
        } else {
          // No automatic sign-in - user must authenticate manually
          setUser(null);
          setLoading(false);
          setError(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!auth) {
    throw new Error('Firebase auth is not configured');
  }
  
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

/**
 * Sign in with Facebook OAuth
 */
export async function signInWithFacebook() {
  if (!auth) {
    throw new Error('Firebase auth is not configured');
  }
  
  const provider = new FacebookAuthProvider();
  return await signInWithPopup(auth, provider);
}

/**
 * Sign in with OAuth provider (Google or Facebook)
 * Since we're not using anonymous accounts, this is a regular sign-in
 */
export async function signInWithOAuth(provider: 'google' | 'facebook') {
  if (!auth) {
    throw new Error('Firebase auth is not configured');
  }

  const authProvider = provider === 'google' 
    ? new GoogleAuthProvider() 
    : new FacebookAuthProvider();
  
  // Sign in with popup
  const result = await signInWithPopup(auth, authProvider);
  
  return result.user;
}

/**
 * @deprecated Use signInWithOAuth instead. Kept for backward compatibility.
 */
export async function linkAnonymousAccount(provider: 'google' | 'facebook') {
  return signInWithOAuth(provider);
}

/**
 * Sign out the current user
 */
export async function signOut() {
  if (!auth) {
    throw new Error('Firebase auth is not configured');
  }
  
  await firebaseSignOut(auth);
}

