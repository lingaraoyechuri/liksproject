/**
 * Get the app ID from global variable or environment
 * Falls back to a default if neither is available
 */
export function getAppId(): string {
  // Check for global __app_id first (for custom deployments)
  if (typeof window !== 'undefined' && (window as any).__app_id) {
    return (window as any).__app_id;
  }

  // Otherwise use environment variable
  return process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app';
}

/**
 * Get the Firestore path for a page's data
 * Pattern: /artifacts/{__app_id}/public/data/links/{pageId}
 */
export function getPageDataPath(pageId: string): string {
  const appId = getAppId();
  return `artifacts/${appId}/public/data/links/${pageId}`;
}

