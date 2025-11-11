'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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

const FloatingLink = styled.a<{ $primaryColor: string; $delay: number }>`
  display: block;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: float ${(props) => 3 + props.$delay * 0.5}s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay * 0.2}s;

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    background: rgba(255, 255, 255, 1);
  }

  &:active {
    transform: translateY(-2px) scale(1);
  }
`;

interface ArtistMusicianProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function ArtistMusician({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: ArtistMusicianProps) {
  const validLinks = links.filter((link) => link.text && link.url);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const displayName = profileData?.name || user?.displayName || '[Artist Name]';
  const bio = profileData?.bio || (user?.email ? 'Musician • Creator • Artist' : '[Musician] • [Creator] • [Artist]');

  return (
    <Container>
      <ProfileSection>
        <ProfileName>{displayName}</ProfileName>
        <Bio>{bio}</Bio>
      </ProfileSection>
      <LinksList>
        {validLinks.map((link, index) => (
          <FloatingLink
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            $primaryColor={currentTheme.primary}
            $delay={index}
            onClick={() => onLinkClick?.(link.id)}
          >
            {link.text}
          </FloatingLink>
        ))}
      </LinksList>
    </Container>
  );
}

