"use client";

import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { THEME_COLORS } from "@/lib/theme/constants";
import { User } from "firebase/auth";
import ShareableUrlDisplay from "@/components/ShareableUrlDisplay";
import ClaimPageModal from "@/components/ClaimPageModal";
import { signOut } from "@/hooks/useAuth";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  min-height: 64px;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    min-height: 56px;
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    justify-content: center;
    flex: 1;
    min-width: 0;
    max-width: 100%;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  color: #ffffff;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 1rem;
  }
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const NavButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;

  ${(props) =>
    props.variant === "primary"
      ? `
    background-color: ${THEME_COLORS.primary};
    color: #ffffff;
    
    &:hover {
      background-color: #FF9F5C;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
    }
  `
      : `
    background-color: transparent;
    color: #374151;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background-color: #f9fafb;
      border-color: #d1d5db;
    }
  `}

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const AvatarButton = styled.div`
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 10rem;
  z-index: 1000;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:first-child {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  color: #ffffff;
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }
`;

interface HeaderProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
  user?: User | null;
  profileFormData?: Record<string, any>;
  shareableUrl?: string;
  slug?: string;
  onSlugChange?: (slug: string) => void;
  onCheckAvailability?: (
    slug: string
  ) => Promise<{ available: boolean; suggestions?: string[] }>;
  onSaveSlug?: (slug: string) => Promise<void>;
  slugChecking?: boolean;
  onSignOut?: () => void;
}

export default function Header({
  onSignIn,
  onSignUp,
  user,
  profileFormData,
  shareableUrl,
  slug,
  onSlugChange,
  onCheckAvailability,
  onSaveSlug,
  slugChecking,
  onSignOut,
}: HeaderProps) {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    // Scroll to top or navigate to home
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if user is authenticated (not anonymous and has a user)
  // Since we no longer create anonymous accounts, just check if user exists
  const isAuthenticated = user && !user.isAnonymous;

  // Handle sign in/up button clicks
  const handleSignInClick = () => {
    setShowSignInModal(true);
    if (onSignIn) onSignIn();
  };

  const handleSignUpClick = () => {
    setShowSignInModal(true);
    if (onSignUp) onSignUp();
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
      if (onSignOut) onSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Handle claim success
  const handleClaimSuccess = (userId: string) => {
    setShowSignInModal(false);
    // The auth state will update automatically via useAuth hook
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Debug logging to trace callback availability
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔵 Header - Callbacks check:", {
        onSlugChange: !!onSlugChange,
        onSaveSlug: !!onSaveSlug,
        onCheckAvailability: !!onCheckAvailability,
        shareableUrl: shareableUrl || "empty",
        slug: slug || "empty",
      });
    }
  }, [
    isAuthenticated,
    onSlugChange,
    onSaveSlug,
    onCheckAvailability,
    shareableUrl,
    slug,
  ]);

  // Get profile picture from profileFormData or user.photoURL
  const profilePic = profileFormData?.profilePic || user?.photoURL || null;

  // Get display name from profileFormData or user.displayName
  const displayName = profileFormData?.name || user?.displayName || "";

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <Logo onClick={handleLogoClick}>
          <LogoIcon>LS</LogoIcon>
          <LogoText>LinkStudio</LogoText>
        </Logo>
      </HeaderLeft>
      <HeaderCenter>
        {onSlugChange && onSaveSlug && (
          <ShareableUrlDisplay
            url={shareableUrl || "https://linkstudio.me/username"}
            slug={slug}
            onSlugChange={onSlugChange}
            onCheckAvailability={onCheckAvailability}
            onSaveSlug={onSaveSlug}
            disabled={slugChecking}
          />
        )}
      </HeaderCenter>
      <HeaderRight>
        <NavActions>
          {isAuthenticated ? (
            <AvatarContainer ref={dropdownRef}>
              <AvatarButton onClick={() => setShowDropdown(!showDropdown)}>
                <Avatar>
                  {profilePic ? (
                    <img src={profilePic} alt={displayName || "User"} />
                  ) : (
                    getInitials(displayName)
                  )}
                </Avatar>
              </AvatarButton>
              <DropdownMenu $isOpen={showDropdown}>
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </DropdownMenu>
            </AvatarContainer>
          ) : (
            <>
              <NavButton onClick={handleSignInClick}>Sign In</NavButton>
              <NavButton variant="primary" onClick={handleSignUpClick}>
                Sign Up
              </NavButton>
            </>
          )}
        </NavActions>
      </HeaderRight>
      <ClaimPageModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onClaimSuccess={handleClaimSuccess}
      />
    </HeaderContainer>
  );
}
