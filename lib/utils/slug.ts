import { collection, query, where, getDocs, Firestore } from 'firebase/firestore';
import { getPageDataPath } from '@/lib/firebase/utils';

/**
 * Validates a slug format
 * - Only lowercase letters, numbers, hyphens, and underscores
 * - 3-30 characters long
 * - Cannot start or end with hyphen or underscore
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Slug cannot be empty' };
  }

  if (slug.length < 3) {
    return { valid: false, error: 'Slug must be at least 3 characters' };
  }

  if (slug.length > 30) {
    return { valid: false, error: 'Slug must be 30 characters or less' };
  }

  // Only allow lowercase letters, numbers, hyphens, and underscores
  const slugRegex = /^[a-z0-9_-]+$/;
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: 'Slug can only contain lowercase letters, numbers, hyphens, and underscores',
    };
  }

  // Cannot start or end with hyphen or underscore
  if (slug.startsWith('-') || slug.startsWith('_')) {
    return { valid: false, error: 'Slug cannot start with a hyphen or underscore' };
  }

  if (slug.endsWith('-') || slug.endsWith('_')) {
    return { valid: false, error: 'Slug cannot end with a hyphen or underscore' };
  }

  return { valid: true };
}

/**
 * Normalizes a slug (converts to lowercase, replaces spaces with hyphens, etc.)
 */
export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9_-]/g, '') // Remove invalid characters
    .replace(/[-_]+/g, '-') // Replace multiple hyphens/underscores with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Checks if a slug is available (not already taken)
 */
export async function isSlugAvailable(
  slug: string,
  currentPageId: string,
  db: Firestore | null
): Promise<boolean> {
  if (!db || !slug) return false;

  try {
    // We need to check all pages to see if the slug is taken
    // Since we're using a nested path structure, we'll need to query differently
    // For now, we'll check by looking for documents with the same slug
    
    // Get the app ID to construct the collection path
    const appId = typeof window !== 'undefined' && (window as any).__app_id
      ? (window as any).__app_id
      : process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    
    const collectionPath = `artifacts/${appId}/public/data/links`;
    const pagesRef = collection(db, collectionPath);
    
    // Query for pages with this slug
    const q = query(pagesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    // Check if any document (other than the current page) has this slug
    let isTaken = false;
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentPageId) {
        isTaken = true;
      }
    });
    
    return !isTaken;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    // On error, assume it's not available to be safe
    return false;
  }
}

/**
 * Suggests alternative slugs if the requested one is taken
 */
export function suggestSlugAlternatives(baseSlug: string, count: number = 5): string[] {
  const suggestions: string[] = [];
  const normalized = normalizeSlug(baseSlug);
  
  // Generate variations
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      suggestions.push(`${normalized}-${Math.floor(Math.random() * 1000)}`);
    } else if (i === 1) {
      suggestions.push(`${normalized}-${Date.now().toString().slice(-4)}`);
    } else if (i === 2) {
      suggestions.push(`${normalized}${Math.floor(Math.random() * 100)}`);
    } else if (i === 3) {
      const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random letter
      suggestions.push(`${normalized}-${randomChar}`);
    } else {
      suggestions.push(`${normalized}-${Math.floor(Math.random() * 10000)}`);
    }
  }
  
  return suggestions;
}

