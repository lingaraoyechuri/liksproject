'use client';

import React from 'react';
import styled from 'styled-components';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 140, 66, 0.2) 0%, transparent 100%);
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 20px rgba(255, 140, 66, 0.5);
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const VideoSection = styled.div`
  padding: 1.5rem;
`;

const VideoCard = styled.a<{ $primaryColor: string }>`
  display: block;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 140, 66, 0.3);
  border-radius: 0.75rem;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: ${(props) => props.$primaryColor};
    box-shadow: 0 0 20px ${(props) => props.$primaryColor}40;
    transform: translateY(-2px);
  }
`;

const VideoThumbnail = styled.div<{ $primaryColor: string }>`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, ${(props) => props.$primaryColor} 0%, ${(props) => props.$primaryColor}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 3rem;
  color: #ffffff;
`;

const PlayIcon = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #000000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const VideoTitle = styled.div`
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
`;

const LinksList = styled.div`
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0 1rem 1rem;
  }
`;

const LinkButton = styled.a<{ $primaryColor: string }>`
  display: block;
  padding: 1rem;
  background: rgba(255, 140, 66, 0.1);
  border: 2px solid ${(props) => props.$primaryColor};
  border-radius: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 0 10px ${(props) => props.$primaryColor}20;

  &:hover {
    background: ${(props) => props.$primaryColor};
    box-shadow: 0 0 20px ${(props) => props.$primaryColor}60;
    transform: translateY(-2px);
  }
`;

interface VideoCreatorFocusProps {
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onLinkClick?: (linkId: string) => void;
  profileData?: Record<string, any>;
}

export default function VideoCreatorFocus({
  links,
  user,
  currentTheme,
  onLinkClick,
  profileData,
}: VideoCreatorFocusProps) {
  const validLinks = links.filter((link) => link.text && link.url);
  const videoLinks = validLinks.filter((link) =>
    link.url.includes('youtube.com') || link.url.includes('youtu.be')
  );
  const otherLinks = validLinks.filter(
    (link) => !link.url.includes('youtube.com') && !link.url.includes('youtu.be')
  );

  // Get profile data from profileData prop, fallback to user data or placeholders
  const displayName = profileData?.name || user?.displayName || '[Video Creator]';
  const bio = profileData?.bio || (user?.email ? 'Content creator • YouTuber • Podcaster' : '[Content creator] • [YouTuber] • [Podcaster]');

  return (
    <Container>
      <Header>
        <ProfileName>{displayName}</ProfileName>
        <Bio>{bio}</Bio>
      </Header>
      <VideoSection>
        {videoLinks.length > 0 ? (
          videoLinks.map((link) => (
            <VideoCard
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              $primaryColor={currentTheme.primary}
              onClick={() => onLinkClick?.(link.id)}
            >
              <VideoThumbnail $primaryColor={currentTheme.primary}>
                <PlayIcon>▶</PlayIcon>
              </VideoThumbnail>
              <VideoTitle>{link.text}</VideoTitle>
            </VideoCard>
          ))
        ) : (
          <VideoCard href="#" $primaryColor={currentTheme.primary}>
            <VideoThumbnail $primaryColor={currentTheme.primary}>
              <PlayIcon>▶</PlayIcon>
            </VideoThumbnail>
            <VideoTitle>Latest Video</VideoTitle>
          </VideoCard>
        )}
      </VideoSection>
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

