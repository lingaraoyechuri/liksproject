'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div<{ $bgColor: string }>`
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background-color: ${(props) => props.$bgColor};
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSide = styled.div<{ $primaryColor: string }>`
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, ${(props) => props.$primaryColor}dd 100%);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
`;

const ProfilePic = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileName = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const Title = styled.p`
  font-size: 0.75rem;
  margin: 0 0 1rem 0;
  opacity: 0.9;
`;

const ContactInfo = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  line-height: 1.6;
`;

const LinksSide = styled.div`
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 1.5rem 1rem;
  }
`;

const LinkButton = styled.a<{ $primaryColor: string }>`
  display: block;
  padding: 0.875rem 1rem;
  background: transparent;
  border: 1.5px solid ${(props) => props.$primaryColor};
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.$primaryColor};
    color: #ffffff;
    transform: translateX(4px);
  }
`;

interface ModernBusinessCardProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function ModernBusinessCard({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: ModernBusinessCardProps) {
  const validLinks = links.filter((link) => link.text && link.url);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const profilePic = profileData?.profilePic || user?.photoURL || null;
  const displayName = profileData?.name || user?.displayName || '[Your Name]';
  const bio = profileData?.bio || (user?.email ? 'Professional Title' : '[Professional Title]');

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
      <ProfileSide $primaryColor={currentTheme.primary}>
        <ProfilePic>
          {profilePic ? (
            <img src={profilePic} alt={displayName} />
          ) : (
            displayName !== '[Your Name]' ? getInitials(displayName) : '👤'
          )}
        </ProfilePic>
        <ProfileName>{displayName}</ProfileName>
        <Title>{bio}</Title>
        <ContactInfo>
          📧 {user?.email || '[email@example.com]'}<br />
          📱 {user?.phoneNumber || '[+1 (555) 123-4567]'}
        </ContactInfo>
      </ProfileSide>
      <LinksSide>
        {validLinks.map((link) => (
          <LinkButton
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            $primaryColor={currentTheme.primary}
            onClick={() => onLinkClick?.(link.id)}
          >
            {link.text}
          </LinkButton>
        ))}
      </LinksSide>
    </Container>
  );
}

