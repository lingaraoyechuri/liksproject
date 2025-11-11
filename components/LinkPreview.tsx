"use client";

import React from "react";
import { Link, Theme } from "@/types";
import { User } from "firebase/auth";
import CreatorClassic from "./layouts/CreatorClassic";
import PhotographerPortfolio from "./layouts/PhotographerPortfolio";
import SmallBusinessShowcase from "./layouts/SmallBusinessShowcase";
import InfluencerProductHub from "./layouts/InfluencerProductHub";
import VideoCreatorFocus from "./layouts/VideoCreatorFocus";
import PremiumCreator from "./layouts/PremiumCreator";
import MinimalistProfessional from "./layouts/MinimalistProfessional";
import ArtistMusician from "./layouts/ArtistMusician";
import RetroAesthetic from "./layouts/RetroAesthetic";
import ModernBusinessCard from "./layouts/ModernBusinessCard";

interface LinkPreviewProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  layoutId?: string;
  onClaimPage?: () => void;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

const LAYOUT_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "creator-classic": CreatorClassic,
  "photographer-portfolio": PhotographerPortfolio,
  "small-business-showcase": SmallBusinessShowcase,
  "influencer-product-hub": InfluencerProductHub,
  "video-creator-focus": VideoCreatorFocus,
  "premium-creator": PremiumCreator,
  "minimalist-professional": MinimalistProfessional,
  "artist-musician": ArtistMusician,
  "retro-aesthetic": RetroAesthetic,
  "modern-business-card": ModernBusinessCard,
};

export default function LinkPreview({
  links,
  user,
  currentTheme,
  layoutId = "creator-classic",
  onClaimPage,
  onLinkClick,
  profileData,
}: LinkPreviewProps) {
  const LayoutComponent = LAYOUT_COMPONENTS[layoutId] || CreatorClassic;

  return (
    <LayoutComponent
      links={links}
      user={user}
      currentTheme={currentTheme}
      onLinkClick={onLinkClick}
      profileData={profileData}
    />
  );
}
