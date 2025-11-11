'use client';

import React from 'react';
import styled from 'styled-components';
import { THEME_COLORS } from '@/lib/theme/constants';

interface Layout {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
  category: 'creator' | 'business' | 'photographer' | 'influencer' | 'premium' | 'professional' | 'artist' | 'retro' | 'business-card';
}

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const LayoutCard = styled.button<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background-color: #ffffff;
  border: 2px solid ${(props) => (props.$isSelected ? THEME_COLORS.primary : '#e5e7eb')};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.$isSelected
      ? `0 4px 12px ${THEME_COLORS.primary}30`
      : '0 2px 4px rgba(0, 0, 0, 0.05)'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) =>
      props.$isSelected
        ? `0 6px 16px ${THEME_COLORS.primary}40`
        : '0 4px 8px rgba(0, 0, 0, 0.1)'};
    border-color: ${(props) => (props.$isSelected ? THEME_COLORS.primary : '#d1d5db')};
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const LayoutPreview = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const LayoutName = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
  text-align: center;
`;

const LayoutDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
  line-height: 1.4;
`;

interface LayoutSelectorProps {
  selectedLayoutId?: string;
  onSelectLayout: (layoutId: string) => void;
  layouts: Layout[];
}

export default function LayoutSelector({
  selectedLayoutId,
  onSelectLayout,
  layouts,
}: LayoutSelectorProps) {
  return (
    <LayoutGrid>
      {layouts.map((layout) => (
        <LayoutCard
          key={layout.id}
          $isSelected={selectedLayoutId === layout.id}
          onClick={() => onSelectLayout(layout.id)}
        >
          <LayoutPreview>{layout.preview}</LayoutPreview>
          <LayoutName>{layout.name}</LayoutName>
          <LayoutDescription>{layout.description}</LayoutDescription>
        </LayoutCard>
      ))}
    </LayoutGrid>
  );
}

