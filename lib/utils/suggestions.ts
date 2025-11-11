/**
 * Analyzes a URL and suggests high-conversion call-to-action text
 * based on common patterns and domains
 * 
 * @param url - The URL to analyze
 * @returns Suggested text or empty string if no suggestion available
 */
export function suggestLinkText(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Normalize URL to lowercase for matching
  const normalizedUrl = url.toLowerCase().trim();

  // YouTube patterns
  if (
    normalizedUrl.includes('youtube.com') ||
    normalizedUrl.includes('youtu.be') ||
    normalizedUrl.includes('youtube.com/watch') ||
    normalizedUrl.includes('youtube.com/channel')
  ) {
    return 'Watch My Latest Video!';
  }

  // E-commerce patterns
  if (
    normalizedUrl.includes('etsy.com') ||
    normalizedUrl.includes('shopify.com') ||
    normalizedUrl.includes('etsy.com/shop') ||
    normalizedUrl.includes('.myshopify.com')
  ) {
    return 'Shop My New Collection';
  }

  // Instagram patterns
  if (
    normalizedUrl.includes('instagram.com') ||
    normalizedUrl.includes('instagr.am')
  ) {
    return 'Follow My Daily Stories';
  }

  // Booking/Calendar patterns
  if (
    normalizedUrl.includes('calendly.com') ||
    normalizedUrl.includes('book.me') ||
    normalizedUrl.includes('cal.com') ||
    normalizedUrl.includes('acuityscheduling.com')
  ) {
    return 'Book a Quick Consultation';
  }

  // Twitter/X patterns
  if (
    normalizedUrl.includes('twitter.com') ||
    normalizedUrl.includes('x.com')
  ) {
    return 'Follow Me on X';
  }

  // TikTok patterns
  if (normalizedUrl.includes('tiktok.com')) {
    return 'Check Out My TikTok';
  }

  // LinkedIn patterns
  if (normalizedUrl.includes('linkedin.com')) {
    return 'Connect on LinkedIn';
  }

  // GitHub patterns
  if (normalizedUrl.includes('github.com')) {
    return 'View My Code';
  }

  // Spotify patterns
  if (
    normalizedUrl.includes('spotify.com') ||
    normalizedUrl.includes('open.spotify.com')
  ) {
    return 'Listen to My Playlist';
  }

  // Medium patterns
  if (normalizedUrl.includes('medium.com')) {
    return 'Read My Latest Article';
  }

  // Patreon patterns
  if (normalizedUrl.includes('patreon.com')) {
    return 'Support My Work';
  }

  // PayPal/Venmo patterns
  if (
    normalizedUrl.includes('paypal.me') ||
    normalizedUrl.includes('venmo.com')
  ) {
    return 'Send a Tip';
  }

  // Email patterns
  if (normalizedUrl.startsWith('mailto:')) {
    return 'Get in Touch';
  }

  // Podcast patterns
  if (
    normalizedUrl.includes('podcast') ||
    normalizedUrl.includes('anchor.fm') ||
    normalizedUrl.includes('spotify.com/podcast')
  ) {
    return 'Listen to My Podcast';
  }

  // Portfolio/Website patterns
  if (
    normalizedUrl.includes('portfolio') ||
    normalizedUrl.includes('behance.net') ||
    normalizedUrl.includes('dribbble.com')
  ) {
    return 'View My Portfolio';
  }

  // Default: no suggestion
  return '';
}

