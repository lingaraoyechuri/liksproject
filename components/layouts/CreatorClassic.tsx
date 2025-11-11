'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div<{ $bgColor: string }>`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background-color: ${(props) => props.$bgColor};
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
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const ProfilePic = styled.div<{ $primaryColor: string }>`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, ${(props) => props.$primaryColor}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #ffffff;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-align: center;
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.5;
`;

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const LinkButton = styled.a<{ $primaryColor: string; $secondaryColor: string; $isSpotlight?: boolean }>`
  display: block;
  width: 100%;
  padding: ${(props) => (props.$isSpotlight ? '1.25rem' : '1rem')};
  background: ${(props) =>
    props.$isSpotlight
      ? `linear-gradient(135deg, ${props.$primaryColor} 0%, ${props.$secondaryColor} 100%)`
      : '#ffffff'};
  color: ${(props) => (props.$isSpotlight ? '#ffffff' : '#374151')};
  border: ${(props) => (props.$isSpotlight ? 'none' : `2px solid ${props.$primaryColor}`)};
  border-radius: 0.75rem;
  font-size: ${(props) => (props.$isSpotlight ? '1.125rem' : '1rem')};
  font-weight: ${(props) => (props.$isSpotlight ? '700' : '600')};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.$isSpotlight
      ? `0 4px 12px rgba(0, 0, 0, 0.15)`
      : '0 2px 4px rgba(0, 0, 0, 0.05)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$isSpotlight
        ? `0 6px 16px rgba(0, 0, 0, 0.2)`
        : `0 4px 8px ${props.$primaryColor}30`};
  }

  &:active {
    transform: translateY(0);
  }
`;

interface CreatorClassicProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function CreatorClassic({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: CreatorClassicProps) {
  const spotlightLink = links.find((link) => link.isSpotlight);
  const regularLinks = links.filter((link) => !link.isSpotlight);
  const sortedLinks = spotlightLink ? [spotlightLink, ...regularLinks] : regularLinks;

  // Get profile data from profileData prop, fallback to user data or placeholders
  const profilePic = profileData?.profilePic || user?.photoURL || null;
  const displayName = profileData?.name || user?.displayName || '[Your Name]';
  const bio = profileData?.bio || (user?.email ? `${user.email.split('@')[0]} • Content creator` : '[Creator] • [Streamer] • [Your tagline]');

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
    <Container $bgColor={currentTheme.bg}>
      <ProfileSection>
        <ProfilePic $primaryColor={currentTheme.primary}>
          {profilePic ? (
            <img src={profilePic} alt={displayName} />
          ) : (
            displayName !== '[Your Name]' ? getInitials(displayName) : '👤'
          )}
        </ProfilePic>
        <ProfileName>{displayName}</ProfileName>
        <Bio>{bio}</Bio>
      </ProfileSection>
      <LinksList>
        {sortedLinks.map((link) => {
          if (!link.text || !link.url) return null;
          return (
            <LinkButton
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              $primaryColor={currentTheme.primary}
              $secondaryColor={currentTheme.secondary}
              $isSpotlight={link.isSpotlight}
              onClick={() => onLinkClick?.(link.id)}
            >
              {link.text}
            </LinkButton>
          );
        })}
      </LinksList>
    </Container>
  );
}

