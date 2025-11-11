// Form field types
export type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'color' | 'toggle' | 'video' | 'product';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  group: 'profile' | 'links' | 'media' | 'theme' | 'content';
  autoFill?: {
    fromPlatform?: string;
    extract?: (value: string) => string;
  };
}

export interface FormSchema {
  layoutId: string;
  category: string;
  fields: FormField[];
  groups: {
    profile?: { title: string; description?: string };
    links?: { title: string; description?: string };
    media?: { title: string; description?: string };
    theme?: { title: string; description?: string };
    content?: { title: string; description?: string };
  };
}

// Generate form schema based on layout and selected platforms
export function generateFormSchema(
  layoutId: string,
  selectedPlatforms: string[]
): FormSchema {
  const layout = getLayoutConfig(layoutId);
  const baseFields = getBaseFields(selectedPlatforms);
  const layoutSpecificFields = getLayoutSpecificFields(layoutId, selectedPlatforms);

  return {
    layoutId,
    category: layout.category,
    fields: [...baseFields, ...layoutSpecificFields],
    groups: {
      profile: {
        title: 'Profile Information',
        description: 'Tell people about yourself',
      },
      links: {
        title: 'Your Links',
        description: 'Manage your social and custom links',
      },
      media: {
        title: 'Media & Content',
        description: 'Add photos, videos, and products',
      },
      theme: {
        title: 'Appearance',
        description: 'Customize colors and style',
      },
      content: {
        title: 'Additional Content',
        description: 'Extra information for your page',
      },
    },
  };
}

function getLayoutConfig(layoutId: string) {
  const configs: Record<string, { category: string; requires: string[] }> = {
    'creator-classic': {
      category: 'creator',
      requires: ['profilePic', 'name', 'bio'],
    },
    'photographer-portfolio': {
      category: 'photographer',
      requires: ['profilePic', 'name', 'bio', 'gallery'],
    },
    'small-business-showcase': {
      category: 'business',
      requires: ['profilePic', 'name', 'bio', 'businessInfo'],
    },
    'influencer-product-hub': {
      category: 'influencer',
      requires: ['profilePic', 'name', 'bio', 'products'],
    },
    'video-creator-focus': {
      category: 'creator',
      requires: ['profilePic', 'name', 'bio', 'videos'],
    },
    'premium-creator': {
      category: 'premium',
      requires: ['profilePic', 'name', 'bio', 'banner'],
    },
    'minimalist-professional': {
      category: 'professional',
      requires: ['profilePic', 'name', 'bio'],
    },
    'artist-musician': {
      category: 'artist',
      requires: ['profilePic', 'name', 'bio', 'gallery'],
    },
    'retro-aesthetic': {
      category: 'retro',
      requires: ['profilePic', 'name', 'bio', 'gallery'],
    },
    'modern-business-card': {
      category: 'business-card',
      requires: ['profilePic', 'name', 'bio', 'contactInfo'],
    },
  };

  return configs[layoutId] || configs['creator-classic'];
}

function getBaseFields(selectedPlatforms: string[]): FormField[] {
  const fields: FormField[] = [
    {
      id: 'profilePic',
      label: 'Profile Picture',
      type: 'image',
      placeholder: 'Upload your profile picture',
      required: true,
      group: 'profile',
    },
    {
      id: 'name',
      label: 'Display Name',
      type: 'text',
      placeholder: 'Your name or brand',
      required: true,
      group: 'profile',
      autoFill: {
        fromPlatform: 'instagram',
        extract: (value) => value.split('/').pop() || '',
      },
    },
    {
      id: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell people about yourself...',
      required: false,
      group: 'profile',
    },
  ];

  return fields;
}

function getLayoutSpecificFields(layoutId: string, selectedPlatforms: string[]): FormField[] {
  const fields: FormField[] = [];

  // Gallery/Images for photographer, artist, retro layouts
  if (
    ['photographer-portfolio', 'artist-musician', 'retro-aesthetic'].includes(layoutId)
  ) {
    fields.push({
      id: 'gallery',
      label: 'Photo Gallery',
      type: 'image',
      placeholder: 'Upload multiple photos',
      required: false,
      group: 'media',
    });
  }

  // Videos for video creator
  if (layoutId === 'video-creator-focus' || selectedPlatforms.includes('youtube')) {
    fields.push({
      id: 'videos',
      label: 'Featured Videos',
      type: 'video',
      placeholder: 'Add YouTube video URLs',
      required: false,
      group: 'media',
      validation: {
        pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
        message: 'Please enter a valid YouTube URL',
      },
      autoFill: {
        fromPlatform: 'youtube',
      },
    });
  }

  // Products for influencer/product hub
  if (layoutId === 'influencer-product-hub' || selectedPlatforms.includes('amazon')) {
    fields.push({
      id: 'products',
      label: 'Promotion Products',
      type: 'product',
      placeholder: 'Add product links (Amazon, Shopify, etc.)',
      required: false,
      group: 'media',
      validation: {
        pattern: /^https?:\/\/.+/,
        message: 'Please enter a valid product URL',
      },
      autoFill: {
        fromPlatform: 'amazon',
      },
    });
  }

  // Banner for premium layouts
  if (layoutId === 'premium-creator') {
    fields.push({
      id: 'banner',
      label: 'Banner Image',
      type: 'image',
      placeholder: 'Upload a banner image',
      required: false,
      group: 'media',
    });
  }

  // Business info for business layouts
  if (['small-business-showcase', 'modern-business-card'].includes(layoutId)) {
    fields.push({
      id: 'businessInfo',
      label: 'Business Description',
      type: 'textarea',
      placeholder: 'Describe your business...',
      required: false,
      group: 'content',
    });

    if (layoutId === 'modern-business-card') {
      fields.push({
        id: 'contactInfo',
        label: 'Contact Information',
        type: 'text',
        placeholder: 'Email or phone',
        required: false,
        group: 'content',
      });
    }
  }

  // Custom CTA for certain layouts
  if (['influencer-product-hub', 'small-business-showcase'].includes(layoutId)) {
    fields.push({
      id: 'primaryCTA',
      label: 'Primary Call-to-Action',
      type: 'text',
      placeholder: 'e.g., "Shop Now", "Book a Call"',
      required: false,
      group: 'content',
    });
  }

  return fields;
}

// Helper to extract platform data for auto-fill
export function extractPlatformData(platformId: string, platformUrl: string): Record<string, string> {
  const data: Record<string, string> = {};

  switch (platformId) {
    case 'instagram':
      const instaMatch = platformUrl.match(/instagram\.com\/([^/?]+)/);
      if (instaMatch) {
        data.name = instaMatch[1];
      }
      break;
    case 'youtube':
      const ytMatch = platformUrl.match(/(?:youtube\.com\/@|youtube\.com\/channel\/|youtu\.be\/)([^/?]+)/);
      if (ytMatch) {
        data.name = ytMatch[1];
      }
      data.videos = platformUrl;
      break;
    case 'amazon':
      data.products = platformUrl;
      break;
  }

  return data;
}

