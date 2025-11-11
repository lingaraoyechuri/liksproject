'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';
import { THEME_COLORS } from '@/lib/theme/constants';
import { LAYOUT_DEFINITIONS } from './layouts';
import LinkPreview from './LinkPreview';
import { useFlowStore } from '@/store/useFlowStore';

const SelectorContainer = styled.div`
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 0;

  @media (min-width: 768px) {
    padding: 0;
  }
`;

// Header removed - no title/description needed

const SlideDeck = styled.div`
  position: relative;
  margin-top: 1rem;

  @media (min-width: 1024px) {
    margin-top: 0.5rem;
  }
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 0.5rem 0;

  @media (min-width: 1024px) {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: visible;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: 1rem 0;
    margin: 0;
    padding-left: 0;
    padding-right: 0;
    max-height: none;
    min-height: 575px; /* Increased by 15% to match card height */
  }

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME_COLORS.primary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${THEME_COLORS.secondary};
  }

  @media (min-width: 768px) {
    gap: 2rem;
  }
`;

const SlideCard = styled.div<{ $isSelected: boolean }>`
  flex: 0 0 auto;
  width: 100%;
  height: 460px; /* Increased by 15% from 400px */
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 1024px) {
    width: 320px;
    height: 575px; /* Increased by 15% from 500px */
    scroll-snap-align: start;
    
    ${(props) =>
      props.$isSelected &&
      `
      transform: scale(1.02);
      z-index: 10;
    `}
  }
`;

const PreviewWrapper = styled.div<{ $isSelected: boolean }>`
  background: #ffffff;
  border: ${(props) => (props.$isSelected ? `3px solid ${THEME_COLORS.primary}` : '2px solid #e5e7eb')};
  border-radius: 1rem;
  padding: 0;
  box-shadow: ${(props) =>
    props.$isSelected
      ? `0 8px 24px ${THEME_COLORS.primary}30`
      : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    border-color: ${(props) => (props.$isSelected ? THEME_COLORS.primary : THEME_COLORS.secondary)};
    box-shadow: ${(props) =>
      props.$isSelected
        ? `0 12px 32px ${THEME_COLORS.primary}40`
        : '0 4px 12px rgba(0, 0, 0, 0.15)'};
    transform: translateY(-4px);
  }
`;

const LayoutPreview = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Override wrapper div */
  > div {
    width: 100% !important;
    min-height: 100% !important;
    max-width: 100% !important;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: visible;
    padding: 1rem 0;
  }

  /* Target the LinkPreview component and its layout containers */
  > div > * {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    transform: scale(0.9);
    transform-origin: top center;
  }

  /* Target nested layout containers (e.g., Container styled components) */
  > div > * > * {
    width: 100% !important;
    max-width: 100% !important;
  }

  @media (min-width: 1024px) {
    > div > * {
      transform: scale(0.85);
    }
  }
`;

// LayoutInfo removed - no name/description needed

const SelectedBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${THEME_COLORS.primary};
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 20;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const NavButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  background-color: ${(props) =>
    props.variant === 'primary' ? THEME_COLORS.primary : '#ffffff'};
  color: ${(props) => (props.variant === 'primary' ? '#ffffff' : '#374151')};
  border: ${(props) => (props.variant === 'primary' ? 'none' : '1px solid #d1d5db')};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.variant === 'primary'
      ? '0 4px 12px rgba(255, 140, 66, 0.3)'
      : '0 1px 3px rgba(0, 0, 0, 0.1)'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.variant === 'primary'
        ? '0 6px 16px rgba(255, 140, 66, 0.4)'
        : '0 2px 6px rgba(0, 0, 0, 0.15)'};
    background-color: ${(props) =>
      props.variant === 'primary' ? THEME_COLORS.secondary : '#f9fafb'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface LayoutSelectorProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  selectedLayoutId?: string;
  onSelectLayout: (layoutId: string) => void;
  onBack?: () => void;
  onNext?: () => void;
}

// Generate mock data for previews
const generateMockLinks = (): Link[] => {
  return [
    {
      id: 'mock-1',
      text: 'Instagram',
      url: 'https://instagram.com/[username]',
      isSpotlight: false,
      clickCount: 0,
    },
    {
      id: 'mock-2',
      text: 'YouTube',
      url: 'https://youtube.com/@[channel]',
      isSpotlight: false,
      clickCount: 0,
    },
    {
      id: 'mock-3',
      text: 'TikTok',
      url: 'https://tiktok.com/@[username]',
      isSpotlight: false,
      clickCount: 0,
    },
  ];
};

export default function LayoutSelector({
  links,
  user,
  currentTheme,
  selectedLayoutId,
  onSelectLayout,
  onBack,
  onNext,
}: LayoutSelectorProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const slideDeckRef = React.useRef<HTMLDivElement>(null);
  
  // Get profileFormData from Zustand store for previews
  const { profileFormData } = useFlowStore();

  // Use mock data if user hasn't added links yet
  const previewLinks = links.length > 0 ? links : generateMockLinks();

  const handleSlideClick = (layoutId: string) => {
    onSelectLayout(layoutId);
    // Scroll to center the selected slide
    if (slideDeckRef.current) {
      const slideIndex = LAYOUT_DEFINITIONS.findIndex((l) => l.id === layoutId);
      const slideWidth = 280 + 24; // card width + gap
      const scrollTo = slideIndex * slideWidth;
      slideDeckRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };

  return (
    <SelectorContainer>
      <SlideDeck>
        <SlideContainer ref={slideDeckRef}>
          {LAYOUT_DEFINITIONS.map((layout) => {
            const isSelected = selectedLayoutId === layout.id;
            return (
              <SlideCard
                key={layout.id}
                $isSelected={isSelected}
                onClick={() => handleSlideClick(layout.id)}
              >
                <PreviewWrapper $isSelected={isSelected}>
                  {isSelected && <SelectedBadge>Selected</SelectedBadge>}
                  <LayoutPreview>
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                      <LinkPreview
                        links={previewLinks}
                        user={user}
                        currentTheme={currentTheme}
                        layoutId={layout.id}
                        profileData={profileFormData}
                      />
                    </div>
                  </LayoutPreview>
                </PreviewWrapper>
              </SlideCard>
            );
          })}
        </SlideContainer>
      </SlideDeck>

      {(onBack || onNext) && (
        <NavigationButtons>
          {onBack ? (
            <NavButton variant="secondary" onClick={onBack}>
              ← Back
            </NavButton>
          ) : (
            <div></div>
          )}
          {onNext && (
            <NavButton variant="primary" onClick={onNext}>
              Next →
            </NavButton>
          )}
        </NavigationButtons>
      )}
    </SelectorContainer>
  );
}

