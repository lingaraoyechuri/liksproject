'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div<{ $bgColor: string }>`
  width: 100%;
  min-height: 100vh;
  padding: 1.5rem;
  background-color: ${(props) => props.$bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 0.5rem 0;
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SocialButton = styled.a<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-decoration: none;
  font-size: 1.25rem;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ProductCard = styled.a<{ $primaryColor: string }>`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div<{ $primaryColor: string }>`
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, ${(props) => props.$primaryColor}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ffffff;
`;

const ProductInfo = styled.div`
  padding: 0.75rem;
`;

const ProductTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #000000;
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
  }
`;

interface InfluencerProductHubProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function InfluencerProductHub({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: InfluencerProductHubProps) {
  const validLinks = links.filter((link) => link.text && link.url);
  const productLinks = validLinks.slice(0, 4);
  const otherLinks = validLinks.slice(4);

  // Get profile data from profileData prop, fallback to user data or placeholders
  const displayName = profileData?.name || user?.displayName || 'influencer';
  const username = displayName.toLowerCase().replace(/\s+/g, '');

  return (
    <Container $bgColor={currentTheme.bg}>
      <ProfileHeader>
        <ProfileName>@{username}</ProfileName>
        <SocialButtons>
          <SocialButton href="#" color="#E4405F">📷</SocialButton>
          <SocialButton href="#" color="#000000">🎵</SocialButton>
          <SocialButton href="#" color="#FF0000">▶️</SocialButton>
        </SocialButtons>
      </ProfileHeader>
      {productLinks.length > 0 && (
        <ProductGrid>
          {productLinks.map((link) => (
            <ProductCard
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              $primaryColor={currentTheme.primary}
              onClick={() => onLinkClick?.(link.id)}
            >
              <ProductImage $primaryColor={currentTheme.primary}>🛍️</ProductImage>
              <ProductInfo>
                <ProductTitle>{link.text}</ProductTitle>
                <ProductPrice>$29.99</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
      <LinksList>
        {otherLinks.map((link) => (
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

