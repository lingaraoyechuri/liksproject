'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div<{ $bgColor: string }>`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, ${(props) => props.$bgColor} 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const BusinessName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 0.5rem 0;
`;

const Tagline = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionCard = styled.a<{ $primaryColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  background: #ffffff;
  border: 2px solid ${(props) => props.$primaryColor};
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px ${(props) => props.$primaryColor}30;
    background: ${(props) => props.$primaryColor}10;
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
`;

const ActionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
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

const LinkButton = styled.a<{ $primaryColor: string }>`
  display: block;
  padding: 1rem;
  background: #ffffff;
  border: 2px solid ${(props) => props.$primaryColor};
  border-radius: 0.75rem;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background: ${(props) => props.$primaryColor};
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

interface SmallBusinessShowcaseProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function SmallBusinessShowcase({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: SmallBusinessShowcaseProps) {
  const validLinks = links.filter((link) => link.text && link.url);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const displayName = profileData?.name || user?.displayName || '[Business Name]';
  const bio = profileData?.bio || (user?.email ? 'Your friendly neighborhood business' : '[Your tagline]');

  return (
    <Container $bgColor={currentTheme.bg}>
      <Header>
        <BusinessName>{displayName}</BusinessName>
        <Tagline>{bio}</Tagline>
      </Header>
      <ActionGrid>
        <ActionCard href="#" $primaryColor={currentTheme.primary}>
          <ActionIcon>📋</ActionIcon>
          <ActionLabel>Menu</ActionLabel>
        </ActionCard>
        <ActionCard href="#" $primaryColor={currentTheme.primary}>
          <ActionIcon>🛒</ActionIcon>
          <ActionLabel>Shop</ActionLabel>
        </ActionCard>
        <ActionCard href="#" $primaryColor={currentTheme.primary}>
          <ActionIcon>📍</ActionIcon>
          <ActionLabel>Location</ActionLabel>
        </ActionCard>
        <ActionCard href="#" $primaryColor={currentTheme.primary}>
          <ActionIcon>📞</ActionIcon>
          <ActionLabel>Contact</ActionLabel>
        </ActionCard>
      </ActionGrid>
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

