'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HeroImage = styled.div<{ $primaryColor: string }>`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, ${(props) => props.$primaryColor}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #ffffff;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 2rem 1.5rem 1.5rem;
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const LinksContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 1rem 0.75rem;
  }
`;

const LinkCard = styled.a<{ $primaryColor: string }>`
  display: block;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 3px solid ${(props) => props.$primaryColor};
  border-radius: 0.5rem;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 1);
  }
`;

interface PhotographerPortfolioProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function PhotographerPortfolio({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: PhotographerPortfolioProps) {
  // Get profile data from profileData prop, fallback to user data or placeholders
  const displayName = profileData?.name || user?.displayName || '[Photographer Name]';
  const bio = profileData?.bio || (user?.email ? 'Capturing moments • Visual storyteller' : '[Your tagline] • [Visual storyteller]');

  return (
    <Container>
      <HeroImage $primaryColor={currentTheme.primary}>
        <Overlay>
          <ProfileName>{displayName}</ProfileName>
          <Bio>{bio}</Bio>
        </Overlay>
      </HeroImage>
      <LinksContainer>
        {links
          .filter((link) => link.text && link.url)
          .map((link) => (
            <LinkCard
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              $primaryColor={currentTheme.primary}
              onClick={() => onLinkClick?.(link.id)}
            >
              {link.text}
            </LinkCard>
          ))}
      </LinksContainer>
    </Container>
  );
}

