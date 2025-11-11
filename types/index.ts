// Link interface - represents a single link in the bio page
export interface Link {
  id: string;
  url: string;
  text: string;
  isSpotlight: boolean;
  clickCount?: number; // Number of clicks on this link (default 0)
}

// Theme interface - represents a theme configuration
export interface Theme {
  id: string;
  name: string;
  primary: string; // hex color
  secondary: string; // hex color
  bg: string; // hex color for background
}

// LinkPageData interface - represents the page data structure
export interface LinkPageData {
  pageId: string;
  userId: string;
  slug?: string; // Custom URL slug (e.g., "my-awesome-page")
  links: Link[];
  themeId?: string; // ID of the selected theme
  layoutId?: string; // ID of the selected layout template
  profileData?: Record<string, any>; // Profile information (name, bio, profilePic, etc.)
  username?: string; // Username for the page
  createdAt?: number;
  updatedAt?: number;
}

