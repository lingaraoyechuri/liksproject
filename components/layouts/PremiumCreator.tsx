"use client";

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProfilePicWrapper = styled.div<{ $primaryColor: string }>`
  position: relative;
  width: 120px;
  height: 120px;
`;

const GlowRing = styled.div<{ $primaryColor: string }>`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: ${(props) => props.$primaryColor};
  opacity: 0.3;
  filter: blur(8px);
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.05);
    }
  }
`;

const ProfilePic = styled.div<{ $primaryColor: string }>`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, ${(props) => props.$primaryColor}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ffffff;
  border: 4px solid ${(props) => props.$primaryColor};
  box-shadow: 0 0 30px ${(props) => props.$primaryColor}50;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-align: center;
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
`;

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const CTAButton = styled.a<{ $primaryColor: string; $isPrimary?: boolean }>`
  display: block;
  padding: 1.25rem;
  background: ${(props) =>
    props.$isPrimary
      ? `linear-gradient(135deg, ${props.$primaryColor} 0%, ${props.$primaryColor}dd 100%)`
      : 'rgba(255, 255, 255, 0.1)'};
  border: ${(props) => (props.$isPrimary ? 'none' : `2px solid ${props.$primaryColor}`)};
  border-radius: 0.75rem;
  color: #ffffff;
  font-size: ${(props) => (props.$isPrimary ? '1.125rem' : '1rem')};
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: ${(props) =>
    props.$isPrimary
      ? `0 4px 12px ${props.$primaryColor}40`
      : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$isPrimary
        ? `0 6px 16px ${props.$primaryColor}60`
        : `0 4px 8px ${props.$primaryColor}30`};
    background: ${(props) =>
      props.$isPrimary
        ? `linear-gradient(135deg, ${props.$primaryColor}dd 0%, ${props.$primaryColor} 100%)`
        : `rgba(255, 140, 66, 0.2)`};
  }
`;

interface PremiumCreatorProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function PremiumCreator({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: PremiumCreatorProps) {
  const validLinks = links.filter((link) => link.text && link.url);
  const spotlightLink = validLinks.find((link) => link.isSpotlight);
  const regularLinks = validLinks.filter((link) => !link.isSpotlight);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const profilePic = profileData?.profilePic || user?.photoURL || null;
  const displayName = profileData?.name || user?.displayName || '[Creator Name]';
  const bio = profileData?.bio || (user?.email ? 'Premium content • Exclusive access' : '[Premium content] • [Exclusive access]');

  // Generate initials for profile pic if no image
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container>
      <ProfileSection>
        <ProfilePicWrapper $primaryColor={currentTheme.primary}>
          <GlowRing $primaryColor={currentTheme.primary} />
          <ProfilePic $primaryColor={currentTheme.primary}>
            {profilePic ? (
              <img src={profilePic} alt={displayName} />
            ) : (
              displayName !== '[Creator Name]' ? getInitials(displayName) : '👤'
            )}
          </ProfilePic>
        </ProfilePicWrapper>
        <ProfileName>{displayName}</ProfileName>
        <Bio>{bio}</Bio>
      </ProfileSection>
      <LinksList>
        {spotlightLink && (
          <CTAButton
            href={spotlightLink.url}
            target="_blank"
            rel="noopener noreferrer"
            $primaryColor={currentTheme.primary}
            $isPrimary
            onClick={() => onLinkClick?.(spotlightLink.id)}
          >
            {spotlightLink.text}
          </CTAButton>
        )}
        {regularLinks.map((link) => (
          <CTAButton
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            $primaryColor={currentTheme.primary}
            onClick={() => onLinkClick?.(link.id)}
          >
            {link.text}
          </CTAButton>
        ))}
      </LinksList>
    </Container>
  );
}