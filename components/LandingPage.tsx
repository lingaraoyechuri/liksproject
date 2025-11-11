"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { THEME_COLORS } from "@/lib/theme/constants";

const LandingContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  overflow-x: hidden;
`;

// Hero Section
const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 85vh;
  animation: fadeInUp 0.8s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1.5rem;
    text-align: center;
    min-height: auto;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeInLeft 1s ease-out 0.2s both;

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const HeroHeadline = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  animation: gradientShift 3s ease infinite;

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtext = styled.p`
  font-size: 1.25rem;
  color: #525252;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  background-size: 200% 200%;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 24px rgba(255, 140, 66, 0.5);
    background-position: 100% 50%;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1);
  }
`;

const SecondaryButton = styled.button`
  padding: 1rem 2rem;
  background-color: #ffffff;
  color: ${THEME_COLORS.primary};
  border: 2px solid ${THEME_COLORS.primary};
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${THEME_COLORS.primary};
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: #ffffff;
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 6px 20px rgba(255, 140, 66, 0.3);

    &::before {
      width: 300px;
      height: 300px;
    }
  }
`;

const HeroVisual = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: fadeInRight 1s ease-out 0.4s both, float 6s ease-in-out infinite;

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const PhoneMockup = styled.div`
  width: 280px;
  height: 560px;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  background-size: 200% 200%;
  border-radius: 2rem;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(255, 140, 66, 0.2);
  position: relative;
  overflow: hidden;
  animation: gradientPulse 4s ease infinite, glow 3s ease-in-out infinite;

  @keyframes gradientPulse {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes glow {
    0%,
    100% {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
        0 0 60px rgba(255, 140, 66, 0.2);
    }
    50% {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
        0 0 80px rgba(255, 140, 66, 0.4);
    }
  }

  @media (max-width: 768px) {
    width: 240px;
    height: 480px;
  }
`;

const PhoneScreen = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${THEME_COLORS.accent};
  border-radius: 1.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-shrink: 0;
`;

const ProfilePic = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ffffff;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const ProfileName = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${THEME_COLORS.primary};
  margin: 0;
  text-align: center;
  line-height: 1.2;
`;

const ProfileDescription = styled.p`
  font-size: 0.625rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.3;
  padding: 0 0.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

const SocialIcon = styled.a<{ platform?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.platform) {
      case "instagram":
        return "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";
      case "youtube":
        return "#FF0000";
      case "twitter":
      case "x":
        return "#000000";
      case "tiktok":
        return "#000000";
      default:
        return `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.secondary} 100%)`;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-decoration: none;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: #ffffff;
  }
`;

const IconSVG = styled.svg`
  width: 16px;
  height: 16px;
  fill: #ffffff;
`;

const MockLink = styled.div<{ $isSpotlight?: boolean; $isContact?: boolean }>`
  width: 100%;
  padding: ${(props) =>
    props.$isSpotlight
      ? "0.875rem"
      : props.$isContact
      ? "0.75rem"
      : "0.625rem"};
  background: ${(props) => {
    if (props.$isSpotlight) {
      return `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.secondary} 100%)`;
    }
    if (props.$isContact) {
      return `linear-gradient(135deg, ${THEME_COLORS.secondary} 0%, ${THEME_COLORS.primary} 100%)`;
    }
    return THEME_COLORS.secondary;
  }};
  border-radius: 0.5rem;
  color: #ffffff;
  font-weight: ${(props) =>
    props.$isSpotlight || props.$isContact ? "700" : "500"};
  font-size: ${(props) =>
    props.$isSpotlight
      ? "0.875rem"
      : props.$isContact
      ? "0.8125rem"
      : "0.75rem"};
  text-align: left;
  box-shadow: ${(props) =>
    props.$isSpotlight || props.$isContact
      ? "0 2px 8px rgba(255, 140, 66, 0.3)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};
  animation: ${(props) => (props.$isSpotlight ? "pulse" : "none")} 2s
    ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  flex-shrink: 0;
  padding-left: 0.875rem;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
`;

const LinkIcon = styled.svg`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  fill: #ffffff;
`;

// Quick Setup Section
const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #000000;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 3rem;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StepCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 140, 66, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 32px rgba(255, 140, 66, 0.25);

    &::before {
      left: 100%;
    }
  }

  &:nth-child(1) {
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }

  &:nth-child(2) {
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }

  &:nth-child(3) {
    animation: fadeInUp 0.6s ease-out 0.6s both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${StepCard}:hover & {
    transform: scale(1.2) rotate(5deg);
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
`;

// Features Section
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 140, 66, 0.1) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 32px rgba(255, 140, 66, 0.2);

    &::after {
      width: 300px;
      height: 300px;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));

  ${FeatureCard}:hover & {
    transform: scale(1.3) rotate(10deg);
    filter: drop-shadow(0 8px 16px rgba(255, 140, 66, 0.3));
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
`;

// For Whom Section
const ForWhomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ForWhomCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(255, 140, 66, 0.2);
  }
`;

const ForWhomTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 1rem;
`;

const ForWhomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ForWhomItem = styled.li`
  font-size: 1.125rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: "✓";
    color: ${THEME_COLORS.primary};
    font-weight: 700;
    font-size: 1.25rem;
  }
`;

// Instant Builder Section
const BuilderSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, ${THEME_COLORS.accent} 0%, #ffffff 100%);
  border-radius: 2rem;
  margin-top: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    border-radius: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`;

const BuilderForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const BuilderInputGroup = styled.div`
  display: flex;
  gap: 0;
  width: 100%;
  min-width: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const BuilderPrefix = styled.span`
  padding: 1rem 0.75rem;
  background-color: #f9fafb;
  border: 2px solid ${THEME_COLORS.primary};
  border-right: none;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: #1f2937;
  white-space: nowrap;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    padding: 0.875rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const BuilderInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 1rem 0.5rem;
  border: 2px solid ${THEME_COLORS.primary};
  border-left: none;
  border-right: none;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 480px) {
    padding: 0.875rem 0.375rem;
    font-size: 0.75rem;
  }
`;

const BuilderSuffix = styled.span`
  padding: 1rem 0.75rem;
  background-color: #f9fafb;
  border: 2px solid ${THEME_COLORS.primary};
  border-left: none;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: #1f2937;
  white-space: nowrap;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    padding: 0.875rem 0.5rem;
    font-size: 0.75rem;
  }

  @media (max-width: 360px) {
    font-size: 0.65rem;
    padding: 0.875rem 0.375rem;
  }
`;

const BuilderButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  background-size: 200% 200%;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 24px rgba(255, 140, 66, 0.5);
    background-position: 100% 50%;

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px) scale(1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviewUrl = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  text-align: center;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: ${THEME_COLORS.primary};
  font-weight: 600;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Testimonials Section
const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 10px;
    font-size: 6rem;
    color: ${THEME_COLORS.primary};
    opacity: 0.1;
    font-family: serif;
    line-height: 1;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 32px rgba(255, 140, 66, 0.2);
  }
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #166534;
  font-weight: 600;
`;

// Pricing Section
const PricingSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 2rem auto 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: ${(props) =>
    props.$featured
      ? `3px solid ${THEME_COLORS.primary}`
      : "1px solid #e5e7eb"};
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  ${(props) =>
    props.$featured &&
    `
    transform: scale(1.05);
    animation: pulse 2s ease-in-out infinite;
    
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(255, 140, 66, 0.4);
      }
      50% {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 10px rgba(255, 140, 66, 0);
      }
    }
    
    @media (max-width: 640px) {
      transform: scale(1);
    }
  `}

  &:hover {
    transform: ${(props) => (props.$featured ? "scale(1.08)" : "scale(1.03)")}
      translateY(-8px);
    box-shadow: 0 16px 40px rgba(255, 140, 66, 0.25);
  }
`;

const PricingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const PricingPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${THEME_COLORS.primary};
  margin-bottom: 1rem;
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PricingFeature = styled.li`
  font-size: 1rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: "✓";
    color: ${THEME_COLORS.primary};
    font-weight: 700;
  }
`;

// Footer
const Footer = styled.footer`
  background-color: #1f2937;
  color: #ffffff;
  padding: 3rem 2rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #374151;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
`;

interface LandingPageProps {
  onStart: (username: string) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [username, setUsername] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleStart = () => {
    if (username.trim()) {
      onStart(username.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/[-_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setUsername(value);
    setShowPreview(value.length > 0);
  };

  return (
    <LandingContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroHeadline>Your Bio, Your Links, Your Way.</HeroHeadline>
          <HeroSubtext>
            Create your custom link page in under 60 seconds — safe, fast, and
            free.
          </HeroSubtext>
          <CTAGroup>
            <PrimaryButton
              onClick={() =>
                document
                  .getElementById("builder")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Free
            </PrimaryButton>
          </CTAGroup>
        </HeroContent>
        <HeroVisual>
          <PhoneMockup>
            <PhoneScreen>
              <ProfileSection>
                <ProfilePic>👤</ProfilePic>
                <ProfileName>@johndoe</ProfileName>
                <ProfileDescription>Creator • Designer</ProfileDescription>
                <SocialLinks>
                  <SocialIcon href="#" title="Instagram" platform="instagram">
                    <IconSVG viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </IconSVG>
                  </SocialIcon>
                  <SocialIcon href="#" title="YouTube" platform="youtube">
                    <IconSVG viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </IconSVG>
                  </SocialIcon>
                  <SocialIcon href="#" title="X (Twitter)" platform="x">
                    <IconSVG viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </IconSVG>
                  </SocialIcon>
                  <SocialIcon href="#" title="TikTok" platform="tiktok">
                    <IconSVG viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </IconSVG>
                  </SocialIcon>
                </SocialLinks>
              </ProfileSection>
              <MockLink $isSpotlight>
                <LinkIcon viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </LinkIcon>
                My Portfolio
              </MockLink>
              <MockLink>
                <LinkIcon viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </LinkIcon>
                Shop Collection
              </MockLink>
              <MockLink>
                <LinkIcon viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </LinkIcon>
                Latest Blog
              </MockLink>
              <MockLink>
                <LinkIcon viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </LinkIcon>
                Watch Videos
              </MockLink>
              <MockLink $isContact>
                <LinkIcon viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </LinkIcon>
                Contact Me
              </MockLink>
            </PhoneScreen>
          </PhoneMockup>
        </HeroVisual>
      </HeroSection>

      {/* Quick Setup Section */}
      <Section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
      >
        <SectionTitle>From zero to live in under a minute.</SectionTitle>
        <SectionSubtitle>
          Three simple steps to get your link page live
        </SectionSubtitle>
        <StepsGrid>
          <StepCard>
            <StepIcon>🧠</StepIcon>
            <StepTitle>Choose your name</StepTitle>
            <StepDescription>
              Pick a unique username for your custom URL
            </StepDescription>
          </StepCard>
          <StepCard>
            <StepIcon>🔗</StepIcon>
            <StepTitle>Add your links</StepTitle>
            <StepDescription>
              Add all your social media and important links
            </StepDescription>
          </StepCard>
          <StepCard>
            <StepIcon>🚀</StepIcon>
            <StepTitle>Go live instantly</StepTitle>
            <StepDescription>
              Your page is live at linkstudio.me/yourname
            </StepDescription>
          </StepCard>
        </StepsGrid>
      </Section>

      {/* Features Section */}
      <Section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
      >
        <SectionTitle>Built for creators, designed for speed</SectionTitle>
        <SectionSubtitle>
          Everything you need, nothing you don't
        </SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🛡️</FeatureIcon>
            <FeatureTitle>Safe for All Platforms</FeatureTitle>
            <FeatureDescription>
              Never get flagged or "orange" again. Trusted by creators
              worldwide.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Lightning-Fast Pages</FeatureTitle>
            <FeatureDescription>
              Loads instantly even on 2G. Optimized for speed and performance.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🌍</FeatureIcon>
            <FeatureTitle>Custom Domains & Branding</FeatureTitle>
            <FeatureDescription>
              Make it truly yours with custom domains and personalized themes.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>No Coding Required</FeatureTitle>
            <FeatureDescription>
              Beautiful themes and customization without writing a single line
              of code.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>💚</FeatureIcon>
            <FeatureTitle>Free Forever</FeatureTitle>
            <FeatureDescription>
              Free forever for small creators. No hidden fees or credit card
              required.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Mobile Optimized</FeatureTitle>
            <FeatureDescription>
              Designed for Instagram, TikTok, YouTube, and all social platforms.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      {/* For Whom Section */}
      <Section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
      >
        <SectionTitle>Perfect for creators and businesses</SectionTitle>
        <ForWhomGrid>
          <ForWhomCard>
            <ForWhomTitle>For Creators</ForWhomTitle>
            <ForWhomList>
              <ForWhomItem>Add all your social links</ForWhomItem>
              <ForWhomItem>Share one link in your bio</ForWhomItem>
              <ForWhomItem>Stay green on all platforms</ForWhomItem>
              <ForWhomItem>Track clicks and engagement</ForWhomItem>
            </ForWhomList>
          </ForWhomCard>
          <ForWhomCard>
            <ForWhomTitle>For Small Businesses</ForWhomTitle>
            <ForWhomList>
              <ForWhomItem>Add WhatsApp / Call / Location buttons</ForWhomItem>
              <ForWhomItem>Add Google Reviews or Menu links</ForWhomItem>
              <ForWhomItem>Turn profile visitors into customers</ForWhomItem>
              <ForWhomItem>Professional branding and themes</ForWhomItem>
            </ForWhomList>
          </ForWhomCard>
        </ForWhomGrid>
      </Section>

      {/* Instant Builder Section */}
      <BuilderSection id="builder">
        <SectionTitle>Create your page now</SectionTitle>
        <SectionSubtitle>
          No sign-up required. Start building instantly.
        </SectionSubtitle>
        <BuilderForm>
          <BuilderInputGroup>
            <BuilderPrefix>https://</BuilderPrefix>
            <BuilderInput
              type="text"
              placeholder="your-username"
              value={username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <BuilderSuffix>linkstudio.me/</BuilderSuffix>
          </BuilderInputGroup>
          {showPreview && (
            <PreviewUrl>
              Your page will be: https://linkstudio.me/{username}
            </PreviewUrl>
          )}
          <BuilderButton onClick={handleStart} disabled={!username.trim()}>
            Create My Page →
          </BuilderButton>
        </BuilderForm>
      </BuilderSection>

      {/* Testimonials Section */}
      <Section
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
      >
        <SectionTitle>Loved by creators</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              "Finally, a link-in-bio that doesn't get flagged! Set up my page
              in 45 seconds."
            </TestimonialText>
            <TestimonialAuthor>— Sarah M., Content Creator</TestimonialAuthor>
          </TestimonialCard>
          <TestimonialCard>
            <TestimonialText>
              "Perfect for my small business. Customers can easily find my
              WhatsApp and location."
            </TestimonialText>
            <TestimonialAuthor>
              — Mike T., Local Business Owner
            </TestimonialAuthor>
          </TestimonialCard>
          <TestimonialCard>
            <TestimonialText>
              "Lightning fast and beautiful. My engagement increased after
              switching to LinkStudio."
            </TestimonialText>
            <TestimonialAuthor>— Emma L., Influencer</TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </Section>

      {/* Pricing Section */}
      <PricingSection>
        <SectionTitle>Simple, transparent pricing</SectionTitle>
        <PricingGrid>
          <PricingCard>
            <PricingTitle>Free</PricingTitle>
            <PricingPrice>$0</PricingPrice>
            <PricingFeatures>
              <PricingFeature>Custom username</PricingFeature>
              <PricingFeature>Unlimited links</PricingFeature>
              <PricingFeature>Beautiful themes</PricingFeature>
              <PricingFeature>Mobile optimized</PricingFeature>
              <PricingFeature>Basic analytics</PricingFeature>
            </PricingFeatures>
            <PrimaryButton style={{ width: "100%", marginTop: "1rem" }}>
              Start Free
            </PrimaryButton>
          </PricingCard>
          <PricingCard $featured>
            <PricingTitle>Pro</PricingTitle>
            <PricingPrice>
              $9<span style={{ fontSize: "1rem" }}>/mo</span>
            </PricingPrice>
            <PricingFeatures>
              <PricingFeature>Everything in Free</PricingFeature>
              <PricingFeature>Custom domain</PricingFeature>
              <PricingFeature>Advanced analytics</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
              <PricingFeature>Remove branding</PricingFeature>
            </PricingFeatures>
            <PrimaryButton style={{ width: "100%", marginTop: "1rem" }}>
              Coming Soon
            </PrimaryButton>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      {/* Footer */}
      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>Product</FooterTitle>
            <FooterLink href="#">Features</FooterLink>
            <FooterLink href="#">Pricing</FooterLink>
            <FooterLink href="#">Examples</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Company</FooterTitle>
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Blog</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Support</FooterTitle>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
            <FooterLink href="#">Privacy</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </FooterSection>
        </FooterContent>
        <FooterBottom>
          Built for creators, with love from LinkStudio
        </FooterBottom>
      </Footer>
    </LandingContainer>
  );
}
