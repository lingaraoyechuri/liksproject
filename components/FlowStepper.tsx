'use client';

import styled from 'styled-components';
import { THEME_COLORS } from '@/lib/theme/constants';

interface FlowStepperProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  steps: string[];
}

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StepIndicator = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 60%;
    right: -40%;
    height: 2px;
    background-color: ${(props) =>
      props.isCompleted || props.isActive
        ? THEME_COLORS.primary
        : '#e5e7eb'};
    transform: translateY(-50%);
    z-index: 0;
  }
`;

const StepCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isCompleted
      ? THEME_COLORS.primary
      : props.isActive
      ? THEME_COLORS.secondary
      : '#e5e7eb'};
  color: ${(props) =>
    props.isCompleted || props.isActive ? '#ffffff' : '#9ca3af'};
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
  cursor: ${(props) => (props.isCompleted ? 'pointer' : 'default')};
  transition: all 0.2s;

  &:hover {
    ${(props) =>
      props.isCompleted &&
      `
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
    `}
  }
`;

const StepLabel = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: ${(props) => (props.isActive ? 600 : 500)};
  color: ${(props) => (props.isActive ? THEME_COLORS.primary : '#6b7280')};
  white-space: nowrap;
  text-align: center;
`;

export default function FlowStepper({
  currentStep,
  totalSteps,
  onStepChange,
  steps,
}: FlowStepperProps) {
  return (
    <StepperContainer>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <StepIndicator
            key={index}
            isActive={isActive}
            isCompleted={isCompleted}
          >
            <StepCircle
              isActive={isActive}
              isCompleted={isCompleted}
              onClick={() => isCompleted && onStepChange(stepNumber)}
            >
              {isCompleted ? '✓' : stepNumber}
            </StepCircle>
            <StepLabel isActive={isActive}>{step}</StepLabel>
          </StepIndicator>
        );
      })}
    </StepperContainer>
  );
}

