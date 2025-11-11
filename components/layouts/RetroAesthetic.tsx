"use client";

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div<{ $bgColor: string }>`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FDF2F8 100%);
  background-size: 200% 200%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(251, 113, 133, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const ProfilePic = styled.div<{ $primaryColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, #F472B6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ffffff;
  margin: 0 auto 1rem;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: #831843;
  margin: 0 0 0.5rem 0;
  font-family: 'Georgia', serif;
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: #9F1239;
  margin: 0;
  font-style: italic;
`;

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const LinkCard = styled.a<{ $primaryColor: string }>`
  display: block;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.$primaryColor};
  border-radius: 1rem;
  color: #831843;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px) rotate(-1deg);
    box-shadow: 0 6px 12px rgba(251, 113, 133, 0.3);
    background: rgba(255, 255, 255, 1);
    border-color: #F472B6;
  }

  &:active {
    transform: translateY(-1px) rotate(0deg);
  }
`;

interface RetroAestheticProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function RetroAesthetic({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: RetroAestheticProps) {
  const validLinks = links.filter((link) => link.text && link.url);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const profilePic = profileData?.profilePic || user?.photoURL || null;
  const displayName = profileData?.name || user?.displayName || '[Creator Name]';
  const bio = profileData?.bio || (user?.email ? 'Lifestyle • Aesthetic • Gen Z vibes' : '[Lifestyle] • [Aesthetic] • [Your vibes]');

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
            displayName !== '[Creator Name]' ? getInitials(displayName) : '👤'
          )}
        </ProfilePic>
        <ProfileName>{displayName}</ProfileName>
        <Bio>{bio}</Bio>
      </ProfileSection>
      <LinksList>
        {validLinks.map((link) => (
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
      </LinksList>
    </Container>
  );
}