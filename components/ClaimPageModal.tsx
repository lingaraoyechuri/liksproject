"use client";

import { useState } from "react";
import styled from "styled-components";
import { THEME_COLORS } from "@/lib/theme/constants";
import { signInWithOAuth } from "@/hooks/useAuth";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ModalDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const OAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const OAuthButton = styled.button<{ provider: "google" | "facebook" }>`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #ffffff;
  color: #374151;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  ${(props) =>
    props.provider === "google" &&
    `
    &:hover {
      border-color: #4285f4;
      background-color: #f8f9fa;
    }
  `}

  ${(props) =>
    props.provider === "facebook" &&
    `
    &:hover {
      border-color: #1877f2;
      background-color: #f0f2f5;
    }
  `}
`;

const ProviderIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: ${THEME_COLORS.primary};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ClaimPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: (userId: string) => void;
}

export default function ClaimPageModal({
  isOpen,
  onClose,
  onClaimSuccess,
}: ClaimPageModalProps) {
  const [loading, setLoading] = useState<"google" | "facebook" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthClaim = async (provider: "google" | "facebook") => {
    setLoading(provider);
    setError(null);

    try {
      // Sign in with OAuth provider
      const user = await signInWithOAuth(provider);

      // Call success callback with new user ID
      onClaimSuccess(user.uid);

      // Close modal
      onClose();
    } catch (err: any) {
      console.error("OAuth claim error:", err);

      let errorMessage = "Failed to claim page. Please try again.";
      if (err?.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (
        err?.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage =
          "An account with this email already exists. Please sign in with that account first.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Claim Your Page</ModalTitle>
        <ModalDescription>
          Sign in to save your page permanently. You'll be able to edit it from
          any device and never lose access.
        </ModalDescription>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <OAuthButtons>
          <OAuthButton
            provider="google"
            onClick={() => handleOAuthClaim("google")}
            disabled={loading !== null}
          >
            {loading === "google" ? (
              <LoadingSpinner />
            ) : (
              <ProviderIcon>🔵</ProviderIcon>
            )}
            Continue with Google
          </OAuthButton>

          <OAuthButton
            provider="facebook"
            onClick={() => handleOAuthClaim("facebook")}
            disabled={loading !== null}
          >
            {loading === "facebook" ? (
              <LoadingSpinner />
            ) : (
              <ProviderIcon>📘</ProviderIcon>
            )}
            Continue with Facebook
          </OAuthButton>
        </OAuthButtons>

        <CloseButton onClick={onClose}>Maybe Later</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}
