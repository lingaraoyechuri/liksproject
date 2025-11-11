'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div<{ $bgColor: string }>`
  width: 100%;
  min-height: 100vh;
  padding: 2.5rem 2rem;
  background-color: ${(props) => props.$bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
`;

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const LinkButton = styled.a<{ $primaryColor: string }>`
  display: block;
  padding: 0.875rem 1rem;
  background: transparent;
  border: 1.5px solid ${(props) => props.$primaryColor};
  border-radius: 0.375rem;
  color: #000000;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.$primaryColor};
    color: #ffffff;
  }
`;

interface MinimalistProfessionalProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function MinimalistProfessional({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: MinimalistProfessionalProps) {
  const validLinks = links.filter((link) => link.text && link.url);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const displayName = profileData?.name || user?.displayName || '[Your Name]';
  const bio = profileData?.bio || (user?.email ? 'Professional • Consultant • Coach' : '[Professional] • [Consultant] • [Coach]');

  return (
    <Container $bgColor={currentTheme.bg}>
      <ProfileSection>
        <ProfileName>{displayName}</ProfileName>
        <Bio>{bio}</Bio>
      </ProfileSection>
      <LinksList>
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
      </LinksList>
    </Container>
  );
}

