// Export all layout components and definitions
export { default as CreatorClassic } from './CreatorClassic';
export { default as PhotographerPortfolio } from './PhotographerPortfolio';
export { default as SmallBusinessShowcase } from './SmallBusinessShowcase';
export { default as InfluencerProductHub } from './InfluencerProductHub';
export { default as VideoCreatorFocus } from './VideoCreatorFocus';
export { default as PremiumCreator } from './PremiumCreator';
export { default as MinimalistProfessional } from './MinimalistProfessional';
export { default as ArtistMusician } from './ArtistMusician';
export { default as RetroAesthetic } from './RetroAesthetic';
export { default as ModernBusinessCard } from './ModernBusinessCard';

export const LAYOUT_DEFINITIONS = [
  {
    id: 'creator-classic',
    name: 'Creator Classic',
    description: 'Perfect for content creators',
    category: 'creator' as const,
  },
  {
    id: 'photographer-portfolio',
    name: 'Photographer Portfolio',
    description: 'Elegant visual showcase',
    category: 'photographer' as const,
  },
  {
    id: 'small-business-showcase',
    name: 'Small Business',
    description: 'Friendly & trustworthy',
    category: 'business' as const,
  },
  {
    id: 'influencer-product-hub',
    name: 'Product Hub',
    description: 'Showcase products & links',
    category: 'influencer' as const,
  },
  {
    id: 'video-creator-focus',
    name: 'Video Creator',
    description: 'Perfect for YouTubers',
    category: 'creator' as const,
  },
  {
    id: 'premium-creator',
    name: 'Premium Creator',
    description: 'Elegant dark mode',
    category: 'premium' as const,
  },
  {
    id: 'minimalist-professional',
    name: 'Minimalist',
    description: 'Clean & professional',
    category: 'professional' as const,
  },
  {
    id: 'artist-musician',
    name: 'Artist / Musician',
    description: 'Creative gradient vibes',
    category: 'artist' as const,
  },
  {
    id: 'retro-aesthetic',
    name: 'Retro Aesthetic',
    description: 'Gen Z lifestyle vibes',
    category: 'retro' as const,
  },
  {
    id: 'modern-business-card',
    name: 'Business Card',
    description: 'Digital business card',
    category: 'business-card' as const,
  },
];

