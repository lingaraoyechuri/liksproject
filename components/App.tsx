"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLinkPage } from "@/hooks/useLinkPage";
import { db, auth } from "@/lib/firebase/config";
import { deleteUser } from "firebase/auth";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import LinkEditor, { PLATFORMS } from "@/components/LinkEditor";
import LinkPreview from "@/components/LinkPreview";
import LandingPage from "@/components/LandingPage";
import Header from "@/components/Header";
import ClaimPageModal from "@/components/ClaimPageModal";
import LayoutSelector from "@/components/LayoutSelector";
import styled from "styled-components";
import { THEME_COLORS } from "@/lib/theme/constants";
import { Theme, Link, LinkPageData } from "@/types";
import { getPageDataPath } from "@/lib/firebase/utils";
import {
  validateSlug,
  normalizeSlug,
  isSlugAvailable,
  suggestSlugAlternatives,
} from "@/lib/utils/slug";
import { useFlowStore } from "@/store/useFlowStore";

// Define the themes array
export const THEMES: Theme[] = [
  {
    id: "light-orange",
    name: "Light Orange",
    primary: "#FF8C42", // Light orange primary (matches app theme)
    secondary: "#FFB366", // Lighter orange secondary
    bg: "#FFF7ED", // Very light orange background
  },
  {
    id: "coral-teal",
    name: "Coral & Teal",
    primary: "#FF6B6B", // Coral
    secondary: "#1ECBA1", // Teal
    bg: "#FFFFFF", // White background
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    primary: "#3B82F6", // Blue
    secondary: "#06B6D4", // Cyan
    bg: "#F0F9FF", // Light blue background
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    primary: "#F97316", // Orange
    secondary: "#FB923C", // Light orange
    bg: "#FFF7ED", // Light orange background
  },
  {
    id: "forest-green",
    name: "Forest Green",
    primary: "#10B981", // Green
    secondary: "#34D399", // Light green
    bg: "#F0FDF4", // Light green background
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    primary: "#8B5CF6", // Purple
    secondary: "#A78BFA", // Light purple
    bg: "#FAF5FF", // Light purple background
  },
];

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: #525252;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: ${THEME_COLORS.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
`;

const ContentContainer = styled.div`
  padding: 2rem;
`;

const WelcomeMessage = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #000000;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #525252;
  margin-bottom: 1.5rem;
`;

const ThemePreview = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.color};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
`;

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: start;
    min-height: calc(100vh - 4rem);
  }
`;

const FlowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0; /* Prevents flex item from overflowing */
`;

const PreviewContainer = styled.div`
  width: 100%;

  @media (min-width: 1024px) {
    width: 400px;
    flex-shrink: 0;
    position: -webkit-sticky;
    position: sticky;
    top: 2rem;
    align-self: start;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const NavButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.variant === "primary" ? THEME_COLORS.primary : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "#ffffff" : "#374151")};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.variant === "primary" ? "#1ab894" : "#e5e7eb"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Section = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #000000;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
  }
`;

const ShareableUrlSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ShareableUrlTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const UrlContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const UrlDisplay = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: #1f2937;
  word-break: break-all;
  user-select: all;
  cursor: text;
`;

const CopyButton = styled.button<{ copied: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.copied ? THEME_COLORS.primary : THEME_COLORS.secondary};
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 4px
    ${(props) =>
      props.copied ? "rgba(30, 203, 161, 0.3)" : "rgba(255, 107, 107, 0.3)"};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px
      ${(props) =>
        props.copied ? "rgba(30, 203, 161, 0.4)" : "rgba(255, 107, 107, 0.4)"};
    background-color: ${(props) => (props.copied ? "#1ab894" : "#ff5252")};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f0fdf4;
  border: 2px solid ${THEME_COLORS.primary};
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SuccessIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
`;

const SuccessText = styled.div`
  flex: 1;
`;

const SuccessTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 0.25rem;
`;

const SuccessDescription = styled.div`
  font-size: 0.875rem;
  color: #047857;
`;

const SlugSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SlugTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const SlugInputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const SlugInputGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SlugInput = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => (props.error ? "#ef4444" : "#e5e7eb")};
  border-radius: 0.375rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.error ? "#ef4444" : THEME_COLORS.primary};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.error ? "rgba(239, 68, 68, 0.1)" : "rgba(30, 203, 161, 0.1)"};
  }
`;

const SlugPrefix = styled.span`
  padding: 0.75rem 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem 0 0 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
`;

const SlugError = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
`;

const SlugSuggestions = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
`;

const SuggestionsTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SuggestionBadge = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: #ffffff;
  border: 1px solid ${THEME_COLORS.primary};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${THEME_COLORS.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${THEME_COLORS.primary};
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

const SaveSlugButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${THEME_COLORS.primary};
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #1ab894;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function App() {
  // Clean up old localStorage entry on mount (one-time cleanup)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("linkstudio-flow-storage")
    ) {
      localStorage.removeItem("linkstudio-flow-storage");
    }
  }, []);

  const { user, loading: authLoading, error: authError } = useAuth();
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [slugInput, setSlugInput] = useState("");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
  const [slugSaved, setSlugSaved] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  // Use Zustand store for flow state
  const {
    linkEditorStep,
    showTheme,
    hasStarted,
    username,
    profileFormData,
    selectedPlatforms,
    platformLinks,
    customLinks,
    setLinkEditorStep,
    setShowTheme,
    setHasStarted,
    setUsername,
    setProfileFormData,
  } = useFlowStore();

  // Generate pageId from user.uid (only when authenticated)
  const pageId = useMemo(() => {
    if (user?.uid && !user.isAnonymous) {
      // Use user.uid as the pageId for simplicity
      // In production, you might want to generate a separate pageId
      return user.uid;
    }
    return null;
  }, [user]);

  // Use the link page hook for data management (only when authenticated)
  const {
    pageData,
    links: firestoreLinks,
    loading: dataLoading,
    error: dataError,
    updateLinks: updateFirestoreLinks,
    updatePageData,
  } = useLinkPage(pageId, user, db);

  // Get links from Zustand store (for unauthenticated users) or Firestore (for authenticated users)
  const links = useMemo(() => {
    // If user is authenticated, use Firestore links
    if (user && !user.isAnonymous && firestoreLinks.length > 0) {
      return firestoreLinks;
    }
    // Otherwise, build links from Zustand store
    const allLinks: Link[] = [];

    // Add platform links
    selectedPlatforms.forEach((platformId) => {
      const platform = PLATFORMS.find((p) => p.id === platformId);
      const platformUsername = platformLinks[platformId]?.trim();
      if (platform && platformUsername) {
        allLinks.push({
          id: `platform-${platformId}`,
          text: platform.name,
          url: `${platform.urlPrefix}${platformUsername}`,
          isSpotlight: false,
          clickCount: 0,
        });
      }
    });

    // Add custom links
    customLinks.forEach((custom) => {
      if (custom.text.trim() && custom.url.trim()) {
        allLinks.push({
          id: custom.id,
          text: custom.text,
          url: custom.url,
          isSpotlight: false,
          clickCount: 0,
        });
      }
    });

    return allLinks;
  }, [user, firestoreLinks, selectedPlatforms, platformLinks, customLinks]);

  // Update links function - saves to Zustand if not authenticated, Firestore if authenticated
  const updateLinks = useCallback(
    (newLinks: Link[]) => {
      console.log("📝 updateLinks called with:", newLinks.length, "links", {
        user: user?.uid,
        isAnonymous: user?.isAnonymous,
      });
      if (user && !user.isAnonymous) {
        // User is authenticated - save to Firestore
        console.log("💾 Saving links to Firestore:", newLinks);
        updateFirestoreLinks(newLinks);
      } else {
        // User is not authenticated - update Zustand store
        // IMPORTANT: Don't overwrite selectedPlatforms - only update platformLinks for platforms that have links
        // This preserves platforms that are selected but don't have usernames yet (user is still typing)
        const {
          selectedPlatforms: currentSelectedPlatforms,
          platformLinks: currentPlatformLinks,
          setPlatformLinks,
          setCustomLinks,
        } = useFlowStore.getState();

        // Parse links to get platform data and custom links
        const platformData: Record<string, string> = {
          ...currentPlatformLinks,
        }; // Start with existing data
        const custom: Array<{ id: string; text: string; url: string }> = [];

        newLinks.forEach((link) => {
          const platform = PLATFORMS.find((p) =>
            link.url.startsWith(p.urlPrefix)
          );
          if (platform) {
            // Only update platformLinks for platforms that have usernames
            platformData[platform.id] = link.url.replace(
              platform.urlPrefix,
              ""
            );
          } else {
            custom.push({
              id: link.id,
              text: link.text,
              url: link.url,
            });
          }
        });

        // Update Zustand store - preserve selectedPlatforms, only update platformLinks and customLinks
        setPlatformLinks(platformData);
        setCustomLinks(custom);
      }
    },
    [user, updateFirestoreLinks]
  );

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Get current theme based on pageData.themeId (if authenticated) or default
  const currentTheme = useMemo(() => {
    if (user && !user.isAnonymous && pageData?.themeId) {
      const theme = THEMES.find((theme) => theme.id === pageData.themeId);
      if (theme) return theme;
    }
    return THEMES[0];
  }, [user, pageData?.themeId]);

  // Get current layout from pageData (if authenticated) or default to creator-classic
  const currentLayoutId =
    user && !user.isAnonymous && pageData?.layoutId
      ? pageData.layoutId
      : "creator-classic";

  // Track previous values to optimize comparisons
  const prevSyncRef = useRef<{
    linksKey: string;
    profileKey: string;
    username: string;
    layoutId: string;
    themeId: string;
  }>({
    linksKey: "",
    profileKey: "",
    username: "",
    layoutId: "",
    themeId: "",
  });

  // Real-time sync: Watch Zustand changes and save to Firebase when authenticated (optimized)
  useEffect(() => {
    // Only sync if user is authenticated
    if (!user || user.isAnonymous || !pageId || !updatePageData || !pageData)
      return;

    // Debounce the sync to avoid too many Firebase writes (increased to 800ms for better batching)
    const syncTimer = setTimeout(() => {
      // Build links from Zustand
      const allLinks: Link[] = [];
      selectedPlatforms.forEach((platformId) => {
        const platform = PLATFORMS.find((p) => p.id === platformId);
        const platformUsername = platformLinks[platformId]?.trim();
        if (platform && platformUsername) {
          allLinks.push({
            id: `platform-${platformId}`,
            text: platform.name,
            url: `${platform.urlPrefix}${platformUsername}`,
            isSpotlight: false,
            clickCount: 0,
          });
        }
      });
      customLinks.forEach((custom) => {
        if (custom.text.trim() && custom.url.trim()) {
          allLinks.push({
            id: custom.id,
            text: custom.text,
            url: custom.url,
            isSpotlight: false,
            clickCount: 0,
          });
        }
      });

      // Prepare data to sync
      const dataToSync: Partial<LinkPageData> = {};
      let hasChanges = false;

      // Optimized: Only stringify if we need to compare (cache previous values)
      const newLinksKey = JSON.stringify(
        allLinks.map((l) => ({ id: l.id, text: l.text, url: l.url }))
      );
      if (prevSyncRef.current.linksKey !== newLinksKey) {
        const currentLinksKey = JSON.stringify(
          (pageData.links || []).map((l) => ({
            id: l.id,
            text: l.text,
            url: l.url,
          }))
        );
        if (currentLinksKey !== newLinksKey) {
          dataToSync.links = allLinks;
          hasChanges = true;
          prevSyncRef.current.linksKey = newLinksKey;
          console.log("🔄 Real-time sync: Links changed");
        }
      }

      // Optimized: Only sync profile data if Zustand has actual data (not empty)
      // This prevents overwriting Firebase data with empty Zustand state on reload
      if (Object.keys(profileFormData).length > 0) {
        const newProfileKey = JSON.stringify(profileFormData);
        if (prevSyncRef.current.profileKey !== newProfileKey) {
          const currentProfileKey = JSON.stringify(pageData.profileData || {});
          // Only sync if Zustand data is different AND not empty
          // This prevents empty Zustand from overwriting Firebase data
          if (currentProfileKey !== newProfileKey && newProfileKey !== "{}") {
            dataToSync.profileData = profileFormData;
            hasChanges = true;
            prevSyncRef.current.profileKey = newProfileKey;
            console.log("🔄 Real-time sync: Profile data changed");
          }
        }
      }

      // Check if username changed (simple string comparison)
      if (username && username.trim() && pageData.username !== username) {
        if (prevSyncRef.current.username !== username) {
          dataToSync.username = username;
          dataToSync.slug = username; // Also update slug
          hasChanges = true;
          prevSyncRef.current.username = username;
          console.log("🔄 Real-time sync: Username changed");
        }
      }

      // Check if layout changed (simple string comparison)
      if (
        currentLayoutId &&
        currentLayoutId !== "creator-classic" &&
        pageData.layoutId !== currentLayoutId
      ) {
        if (prevSyncRef.current.layoutId !== currentLayoutId) {
          dataToSync.layoutId = currentLayoutId;
          hasChanges = true;
          prevSyncRef.current.layoutId = currentLayoutId;
        }
      }

      // Check if theme changed (simple string comparison)
      if (currentTheme.id && pageData.themeId !== currentTheme.id) {
        if (prevSyncRef.current.themeId !== currentTheme.id) {
          dataToSync.themeId = currentTheme.id;
          hasChanges = true;
          prevSyncRef.current.themeId = currentTheme.id;
        }
      }

      // Save to Firebase only if there are actual changes
      // REMOVED duplicate updateDoc call - updatePageData already handles the save
      if (hasChanges && Object.keys(dataToSync).length > 0) {
        console.log("💾 Real-time sync: Saving to Firebase:", dataToSync);
        updatePageData(dataToSync);
      }
    }, 800); // Increased debounce to 800ms for better batching

    return () => clearTimeout(syncTimer);
  }, [
    user,
    pageId,
    pageData,
    selectedPlatforms,
    platformLinks,
    customLinks,
    profileFormData,
    username,
    currentLayoutId,
    currentTheme.id,
    updatePageData,
  ]);

  // Generate the full shareable URL - only available when authenticated
  const shareableUrl = useMemo(() => {
    if (!user || user.isAnonymous || !pageId) return "";
    // Use slug if available and not empty, otherwise fall back to pageId
    const urlSlug =
      pageData?.slug && pageData.slug.trim() ? pageData.slug : pageId;
    return `https://linkstudio.me/${urlSlug}`;
  }, [user, pageId, pageData?.slug]);

  // Loading and error states - only show loading if authenticated and loading data
  const loading = authLoading || (user && !user.isAnonymous && dataLoading);
  const error = authError || (user && !user.isAnonymous && dataError);

  useEffect(() => {
    // Ensure user is authenticated
    if (!authLoading && user) {
      console.log("User authenticated:", user.uid);
      console.log("Page ID:", pageId);
    }
  }, [user, authLoading, pageId]);

  // Initialize Zustand from Firebase when pageData loads (one-time sync from Firebase to Zustand)
  const hasInitializedFromFirebase = useRef(false);

  useEffect(() => {
    if (
      pageData &&
      user &&
      !user.isAnonymous &&
      !hasInitializedFromFirebase.current
    ) {
      console.log("📥 Initializing Zustand from Firebase pageData:", pageData);

      // Initialize profileFormData from Firebase if it exists and Zustand is empty
      if (
        pageData.profileData &&
        Object.keys(pageData.profileData).length > 0
      ) {
        const firebaseProfileData = pageData.profileData;
        const zustandProfileData = profileFormData;

        // Only initialize if Zustand is empty or has different data
        const zustandIsEmpty =
          !zustandProfileData || Object.keys(zustandProfileData).length === 0;
        const dataDiffers =
          JSON.stringify(zustandProfileData) !==
          JSON.stringify(firebaseProfileData);

        if (zustandIsEmpty || dataDiffers) {
          console.log(
            "🔄 Loading profileData from Firebase to Zustand:",
            firebaseProfileData
          );
          setProfileFormData(firebaseProfileData);

          // Update the sync ref to prevent overwriting on next sync cycle
          const profileKey = JSON.stringify(firebaseProfileData);
          prevSyncRef.current.profileKey = profileKey;
        }
      }

      // Initialize username from Firebase if it exists and Zustand is empty
      if (pageData.username && pageData.username.trim() && !username) {
        console.log(
          "🔄 Loading username from Firebase to Zustand:",
          pageData.username
        );
        setUsername(pageData.username);

        // Update the sync ref to prevent overwriting on next sync cycle
        prevSyncRef.current.username = pageData.username;
      }

      hasInitializedFromFirebase.current = true;
    }
  }, [
    pageData,
    user,
    profileFormData,
    username,
    setProfileFormData,
    setUsername,
  ]);

  useEffect(() => {
    if (pageData) {
      console.log("Page data loaded:", pageData);
      console.log("Links count:", links.length);
      // Hide landing page if we have a slug OR if user has already started
      if (pageData.slug || hasStarted) {
        setShowLanding(false);
      }
    }
  }, [pageData, links, hasStarted]);

  // Initialize slug input from pageData or username from landing page
  useEffect(() => {
    if (pageData?.slug) {
      // Use slug from Firebase if available
      setSlugInput(pageData.slug);
      setShowLanding(false); // Hide landing if we have pageData with slug
    } else if (username) {
      // Use username from landing page if no Firebase slug
      setSlugInput(username);
    } else if (pageData && !pageData.slug) {
      // If we have pageData but no slug, only show landing if user hasn't started
      setSlugInput("");
      if (!hasStarted) {
        setShowLanding(true);
      }
    } else {
      // Initialize with empty string if no slug exists
      setSlugInput("");
    }
  }, [pageData?.slug, pageData, hasStarted, username]);

  // Handle slug input change - updates Zustand
  const handleSlugInputChange = (value: string) => {
    const normalized = normalizeSlug(value);
    setSlugInput(normalized);
    setUsername(normalized); // Update username in Zustand
    console.log("📝 Zustand Store - Username updated:", normalized);
    console.log("📦 Full Zustand Store:", {
      username: normalized,
      selectedPlatforms,
      platformLinks,
      customLinks,
      profileFormData,
    });
    setSlugError(null);
    setSlugSuggestions([]);
    setSlugSaved(false);
  };

  // Check slug availability and validate
  const handleCheckSlug = async (): Promise<boolean> => {
    if (!slugInput || !pageId || !db) return false;

    setSlugChecking(true);
    setSlugError(null);
    setSlugSuggestions([]);

    // Validate format
    const validation = validateSlug(slugInput);
    if (!validation.valid) {
      setSlugError(validation.error || "Invalid slug format");
      setSlugChecking(false);
      return false;
    }

    // Check availability
    const available = await isSlugAvailable(slugInput, pageId, db);
    if (available) {
      // Slug is available, save it
      try {
        await updatePageData({ slug: slugInput });
        setSlugSaved(true);
        setTimeout(() => setSlugSaved(false), 3000);
        setSlugChecking(false);
        return true;
      } catch (error: any) {
        setSlugError("Failed to save slug. Please try again.");
        setSlugChecking(false);
        return false;
      }
    } else {
      // Slug is taken, suggest alternatives
      setSlugError("This URL is already taken");
      const suggestions = suggestSlugAlternatives(slugInput, 5);
      setSlugSuggestions(suggestions);
      setSlugChecking(false);
      return false;
    }
  };

  // Use a suggested slug
  const handleUseSuggestion = async (suggestedSlug: string) => {
    setSlugInput(suggestedSlug);
    setSlugError(null);
    setSlugSuggestions([]);

    try {
      await updatePageData({ slug: suggestedSlug });
      setSlugSaved(true);
      setTimeout(() => setSlugSaved(false), 3000);
    } catch (error: any) {
      setSlugError("Failed to save slug. Please try again.");
    }
  };

  /**
   * Handles saving all user data to Firestore after authentication
   * This is called after OAuth sign-in completes
   * Saves all data from Zustand store to Firestore
   *
   * @param userId - The user ID from authentication
   */
  const handleClaimPage = async (userId: string) => {
    if (!user || !auth || !db) {
      setClaimError("Unable to save page: Missing required data");
      return;
    }

    try {
      // Use userId as pageId
      const docPath = getPageDataPath(userId);
      const docRef = doc(db, docPath);

      // Build links array from Zustand store
      const allLinks: Link[] = [];

      // Add platform links
      selectedPlatforms.forEach((platformId) => {
        const platform = PLATFORMS.find((p) => p.id === platformId);
        const platformUsername = platformLinks[platformId]?.trim();
        if (platform && platformUsername) {
          allLinks.push({
            id: `platform-${platformId}`,
            text: platform.name,
            url: `${platform.urlPrefix}${platformUsername}`,
            isSpotlight: false,
            clickCount: 0,
          });
        }
      });

      // Add custom links
      customLinks.forEach((custom) => {
        if (custom.text.trim() && custom.url.trim()) {
          allLinks.push({
            id: custom.id,
            text: custom.text,
            url: custom.url,
            isSpotlight: false,
            clickCount: 0,
          });
        }
      });

      // Create initial document with all data from Zustand
      await setDoc(
        docRef,
        {
          pageId: userId,
          userId: userId,
          links: allLinks,
          layoutId: currentLayoutId,
          themeId: currentTheme.id,
          profileData: profileFormData,
          username: username || undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      console.log("✅ Page created and data saved successfully by:", userId);
      console.log("📦 Saved data:", {
        profileData: profileFormData,
        layoutId: currentLayoutId,
        links: allLinks,
        username,
      });

      // Show success message
      setClaimSuccess(true);
      setClaimError(null);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setClaimSuccess(false);
      }, 5000);

      // Close the modal
      setShowCompleteModal(false);
    } catch (error: any) {
      console.error("❌ Error saving page:", error);
      setClaimError(error?.message || "Failed to save page. Please try again.");
      setClaimSuccess(false);
    }
  };

  /**
   * Opens the claim modal for OAuth sign-in
   */
  const handleOpenClaimModal = () => {
    if (user?.isAnonymous) {
      setShowClaimModal(true);
    }
  };

  if (loading) {
    return (
      <AppContainer>
        <Header
          user={user}
          profileFormData={profileFormData}
          shareableUrl={shareableUrl}
          slug={
            pageData?.slug !== undefined && pageData.slug.trim()
              ? pageData.slug
              : username || slugInput || ""
          }
          onSlugChange={handleSlugInputChange}
          onCheckAvailability={async (slug) => {
            if (!slug.trim() || !pageId || !db) {
              return { available: false };
            }
            const normalizedSlug = normalizeSlug(slug);
            const validation = validateSlug(normalizedSlug);
            if (!validation.valid) {
              setSlugError(validation.error || "Invalid slug format");
              return { available: false };
            }
            const available = await isSlugAvailable(normalizedSlug, pageId, db);
            if (!available) {
              const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
              return { available: false, suggestions };
            }
            return { available: true };
          }}
          onSaveSlug={async (slug) => {
            if (!user || user.isAnonymous || !pageId) {
              return;
            }
            if (!slug.trim()) {
              await updatePageData({ slug: "", username: "" });
              setSlugInput("");
              setUsername("");
              return;
            }
            const normalizedSlug = normalizeSlug(slug);
            const validation = validateSlug(normalizedSlug);
            if (!validation.valid) {
              setSlugError(validation.error || "Invalid slug format");
              return;
            }
            setSlugChecking(true);
            setSlugError(null);
            try {
              const available = await isSlugAvailable(
                normalizedSlug,
                pageId,
                db
              );
              if (available) {
                // Only use updatePageData - it handles the save with debouncing
                updatePageData({
                  slug: normalizedSlug,
                  username: normalizedSlug,
                });
                setSlugInput(normalizedSlug);
                setUsername(normalizedSlug);
              } else {
                const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
                setSlugError("This username is already taken");
                setSlugSuggestions(suggestions);
              }
            } catch (err: any) {
              console.error("❌ Error saving to Firebase:", err);
              setSlugError(err?.message || "Failed to check slug availability");
            } finally {
              setSlugChecking(false);
            }
          }}
          slugChecking={slugChecking}
        />
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading your page...</LoadingText>
        </LoadingContainer>
      </AppContainer>
    );
  }

  if (error) {
    const isConfigError =
      error.includes("Firebase is not configured") ||
      error.includes("Invalid Firebase API key") ||
      error.includes("Anonymous Authentication is not enabled");

    return (
      <AppContainer>
        <Header
          user={user}
          profileFormData={profileFormData}
          shareableUrl={shareableUrl}
          slug={
            pageData?.slug !== undefined && pageData.slug.trim()
              ? pageData.slug
              : username || slugInput || ""
          }
          onSlugChange={handleSlugInputChange}
          onCheckAvailability={async (slug) => {
            if (!slug.trim() || !pageId || !db) {
              return { available: false };
            }
            const normalizedSlug = normalizeSlug(slug);
            const validation = validateSlug(normalizedSlug);
            if (!validation.valid) {
              setSlugError(validation.error || "Invalid slug format");
              return { available: false };
            }
            const available = await isSlugAvailable(normalizedSlug, pageId, db);
            if (!available) {
              const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
              return { available: false, suggestions };
            }
            return { available: true };
          }}
          onSaveSlug={async (slug) => {
            if (!user || user.isAnonymous || !pageId) {
              return;
            }
            if (!slug.trim()) {
              await updatePageData({ slug: "", username: "" });
              setSlugInput("");
              setUsername("");
              return;
            }
            const normalizedSlug = normalizeSlug(slug);
            const validation = validateSlug(normalizedSlug);
            if (!validation.valid) {
              setSlugError(validation.error || "Invalid slug format");
              return;
            }
            setSlugChecking(true);
            setSlugError(null);
            try {
              const available = await isSlugAvailable(
                normalizedSlug,
                pageId,
                db
              );
              if (available) {
                // Only use updatePageData - it handles the save with debouncing
                updatePageData({
                  slug: normalizedSlug,
                  username: normalizedSlug,
                });
                setSlugInput(normalizedSlug);
                setUsername(normalizedSlug);
              } else {
                const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
                setSlugError("This username is already taken");
                setSlugSuggestions(suggestions);
              }
            } catch (err: any) {
              console.error("❌ Error saving to Firebase:", err);
              setSlugError(err?.message || "Failed to check slug availability");
            } finally {
              setSlugChecking(false);
            }
          }}
          slugChecking={slugChecking}
        />
        <ContentContainer>
          <WelcomeMessage>
            <Title>Configuration Required</Title>
            <Subtitle>{error}</Subtitle>
            <UserInfo>
              {error.includes("Anonymous Authentication is not enabled") ? (
                <>
                  <strong>To enable Anonymous Authentication:</strong>
                  <ol style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Firebase Console
                      </a>
                    </li>
                    <li>Select your project</li>
                    <li>Navigate to Authentication → Sign-in method</li>
                    <li>Enable "Anonymous" sign-in provider</li>
                    <li>
                      Save and wait a few moments for changes to propagate
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  Please create a <code>.env.local</code> file in the root
                  directory with your Firebase credentials.
                  <br />
                  <br />
                  See the README.md for setup instructions.
                </>
              )}
            </UserInfo>
          </WelcomeMessage>
        </ContentContainer>
      </AppContainer>
    );
  }

  const handleLandingStart = async (usernameInput: string) => {
    // Store username in Zustand
    setUsername(usernameInput);

    // Mark that user has started
    setHasStarted(true);
    setShowLanding(false);

    // Normalize the username to a slug format
    const normalizedSlug = usernameInput
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/[-_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Set slug input for display (will be used in ShareableUrlDisplay)
    setSlugInput(normalizedSlug);

    // If authenticated, try to save the slug
    if (normalizedSlug && user && !user.isAnonymous && pageData) {
      await handleCheckSlug();
    }
  };

  // Show landing page only if:
  // 1. showLanding is true
  // 2. Data is not loading
  // 3. User hasn't started yet (hasStarted is false)
  // 4. Either no pageData exists OR pageData exists but has no slug
  // 5. User is NOT authenticated (no user or user is anonymous)
  const shouldShowLanding =
    showLanding &&
    !dataLoading &&
    !hasStarted &&
    (!pageData || !pageData.slug) &&
    (!user || user.isAnonymous);

  if (shouldShowLanding) {
    return (
      <AppContainer>
        <Header
          user={user}
          profileFormData={profileFormData}
          shareableUrl={shareableUrl}
          slug={
            pageData?.slug !== undefined && pageData.slug.trim()
              ? pageData.slug
              : username || slugInput || ""
          }
          onSlugChange={handleSlugInputChange}
          onCheckAvailability={async (slug) => {
            if (!slug.trim() || !pageId || !db) {
              return { available: false };
            }
            const normalizedSlug = normalizeSlug(slug);
            const validation = validateSlug(normalizedSlug);
            if (!validation.valid) {
              setSlugError(validation.error || "Invalid slug format");
              return { available: false };
            }
            const available = await isSlugAvailable(normalizedSlug, pageId, db);
            if (!available) {
              const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
              return { available: false, suggestions };
            }
            return { available: true };
          }}
          onSaveSlug={async (slug) => {
            console.log("🔥 onSaveSlug called with:", slug);
            console.log("🔍 Auth state:", {
              user: !!user,
              isAnonymous: user?.isAnonymous,
              pageId: pageId,
            });

            // If user is not authenticated, just save to Zustand (already done via onSlugChange)
            // The data will be saved to Firebase when they authenticate
            if (!user || user.isAnonymous || !pageId) {
              console.log(
                "⚠️ User not authenticated, username saved to Zustand only"
              );
              return;
            }

            // Allow empty slug (user can clear it)
            if (!slug.trim()) {
              await updatePageData({ slug: "", username: "" });
              setSlugInput("");
              setUsername(""); // Clear username from Zustand too
              console.log("🗑️ Cleared username in Firebase");
              return;
            }

            const normalizedSlug = normalizeSlug(slug);
            const validation = validateSlug(normalizedSlug);
            if (!validation.valid) {
              console.error("❌ Invalid slug format:", validation.error);
              setSlugError(validation.error || "Invalid slug format");
              return;
            }
            setSlugChecking(true);
            setSlugError(null);
            try {
              console.log("🔍 Checking availability for:", normalizedSlug);
              const available = await isSlugAvailable(
                normalizedSlug,
                pageId,
                db
              );
              console.log("✅ Availability check result:", available);
              if (available) {
                console.log("💾 Saving to Firebase:", normalizedSlug);
                console.log("📊 Current pageData before save:", pageData);

                // Only use updatePageData - it handles the save with debouncing
                // The real-time sync will also pick up the username change from Zustand
                updatePageData({
                  slug: normalizedSlug,
                  username: normalizedSlug,
                });
                setSlugInput(normalizedSlug);
                setUsername(normalizedSlug); // Update username in Zustand
                console.log("🔥 Firebase - Username saved:", normalizedSlug);
                console.log("📦 Zustand Store after Firebase save:", {
                  username: normalizedSlug,
                  selectedPlatforms,
                  platformLinks,
                  customLinks,
                  profileFormData,
                });
                setSlugSaved(true);
                setTimeout(() => setSlugSaved(false), 3000);
              } else {
                const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
                console.warn("⚠️ Username not available:", normalizedSlug);
                setSlugError("This username is already taken");
                setSlugSuggestions(suggestions);
              }
            } catch (err: any) {
              console.error("❌ Error saving to Firebase:", err);
              setSlugError(err?.message || "Failed to check slug availability");
            } finally {
              setSlugChecking(false);
            }
          }}
          slugChecking={slugChecking}
        />
        <LandingPage onStart={handleLandingStart} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header
        user={user}
        profileFormData={profileFormData}
        shareableUrl={shareableUrl}
        slug={
          pageData?.slug !== undefined && pageData.slug.trim()
            ? pageData.slug
            : username || slugInput || ""
        }
        onSlugChange={handleSlugInputChange}
        onCheckAvailability={async (slug) => {
          if (!slug.trim() || !pageId || !db) {
            return { available: false };
          }
          const normalizedSlug = normalizeSlug(slug);
          const validation = validateSlug(normalizedSlug);
          if (!validation.valid) {
            setSlugError(validation.error || "Invalid slug format");
            return { available: false };
          }
          const available = await isSlugAvailable(normalizedSlug, pageId, db);
          if (!available) {
            const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
            return { available: false, suggestions };
          }
          return { available: true };
        }}
        onSaveSlug={async (slug) => {
          console.log("🔥 onSaveSlug called with:", slug);
          console.log("🔍 Auth state:", {
            user: !!user,
            isAnonymous: user?.isAnonymous,
            pageId: pageId,
          });

          // If user is not authenticated, just save to Zustand (already done via onSlugChange)
          // The data will be saved to Firebase when they authenticate
          if (!user || user.isAnonymous || !pageId) {
            console.log(
              "⚠️ User not authenticated, username saved to Zustand only"
            );
            return;
          }

          // Allow empty slug (user can clear it)
          if (!slug.trim()) {
            await updatePageData({ slug: "", username: "" });
            setSlugInput("");
            setUsername(""); // Clear username from Zustand too
            console.log("🗑️ Cleared username in Firebase");
            return;
          }

          const normalizedSlug = normalizeSlug(slug);
          const validation = validateSlug(normalizedSlug);
          if (!validation.valid) {
            console.error("❌ Invalid slug format:", validation.error);
            setSlugError(validation.error || "Invalid slug format");
            return;
          }
          setSlugChecking(true);
          setSlugError(null);
          try {
            console.log("🔍 Checking availability for:", normalizedSlug);
            const available = await isSlugAvailable(normalizedSlug, pageId, db);
            console.log("✅ Availability check result:", available);
            if (available) {
              console.log("💾 Saving to Firebase:", normalizedSlug);
              console.log("📊 Current pageData before save:", pageData);

              // Only use updatePageData - it handles the save with debouncing
              // The real-time sync will also pick up the username change from Zustand
              updatePageData({
                slug: normalizedSlug,
                username: normalizedSlug,
              });
              setSlugInput(normalizedSlug);
              setUsername(normalizedSlug); // Update username in Zustand
              console.log("🔥 Firebase - Username saved:", normalizedSlug);
              console.log("📦 Zustand Store after Firebase save:", {
                username: normalizedSlug,
                selectedPlatforms,
                platformLinks,
                customLinks,
                profileFormData,
              });
              setSlugSaved(true);
              setTimeout(() => setSlugSaved(false), 3000);
            } else {
              const suggestions = suggestSlugAlternatives(normalizedSlug, 5);
              console.warn("⚠️ Username not available:", normalizedSlug);
              setSlugError("This username is already taken");
              setSlugSuggestions(suggestions);
            }
          } catch (err: any) {
            console.error("❌ Error saving to Firebase:", err);
            setSlugError(err?.message || "Failed to check slug availability");
          } finally {
            setSlugChecking(false);
          }
        }}
        slugChecking={slugChecking}
      />
      <ContentContainer>
        {(user && !user.isAnonymous ? !dataLoading && pageData : true) ? (
          <AppLayout>
            <FlowContainer>
              {!showTheme ? (
                <StepContent>
                  <LinkEditor
                    links={links}
                    onUpdateLinks={updateLinks}
                    themes={THEMES}
                    currentTheme={currentTheme}
                    onThemeChange={(themeId) => updatePageData({ themeId })}
                    hideTheme={true}
                    layoutId={currentLayoutId}
                    user={user}
                    onStepChange={setLinkEditorStep}
                    onComplete={() => setShowCompleteModal(true)}
                    onProfileDataChange={(data) => {
                      if (user && !user.isAnonymous) {
                        updatePageData({ profileData: data });
                      }
                    }}
                  />
                </StepContent>
              ) : (
                <StepContent>
                  {linkEditorStep !== 4 && (
                    <>
                      <SectionTitle>Choose Layout & Theme</SectionTitle>
                      <LayoutSelector
                        links={links}
                        user={user}
                        currentTheme={currentTheme}
                        selectedLayoutId={currentLayoutId}
                        onSelectLayout={(layoutId) =>
                          updatePageData({ layoutId })
                        }
                        onBack={() => setShowTheme(false)}
                        onNext={
                          !isDesktop ? () => setShowTheme(false) : undefined
                        }
                      />
                      <div style={{ marginTop: "2rem" }}>
                        <LinkEditor
                          links={links}
                          onUpdateLinks={updateLinks}
                          themes={THEMES}
                          currentTheme={currentTheme}
                          onThemeChange={(themeId) =>
                            updatePageData({ themeId })
                          }
                          showOnlyTheme={true}
                          onStepChange={setLinkEditorStep}
                          onProfileDataChange={(data) => {
                            if (user && !user.isAnonymous) {
                              updatePageData({ profileData: data });
                            }
                          }}
                        />
                      </div>
                    </>
                  )}
                  {linkEditorStep === 4 && (
                    <LinkEditor
                      links={links}
                      onUpdateLinks={updateLinks}
                      themes={THEMES}
                      currentTheme={currentTheme}
                      onThemeChange={(themeId) => updatePageData({ themeId })}
                      hideTheme={true}
                      layoutId={currentLayoutId}
                      user={user}
                      onStepChange={setLinkEditorStep}
                      onComplete={() => setShowCompleteModal(true)}
                      onProfileDataChange={(data) => {
                        if (user && !user.isAnonymous) {
                          updatePageData({ profileData: data });
                        }
                      }}
                    />
                  )}
                </StepContent>
              )}
            </FlowContainer>
            {isDesktop && linkEditorStep !== 4 && (
              <PreviewContainer>
                <LayoutSelector
                  links={links}
                  user={user}
                  currentTheme={currentTheme}
                  selectedLayoutId={currentLayoutId}
                  onSelectLayout={(layoutId) => updatePageData({ layoutId })}
                />
              </PreviewContainer>
            )}
          </AppLayout>
        ) : (
          <WelcomeMessage>
            <Title>Welcome to LinkStudio</Title>
            <Subtitle>
              Your application is set up with anonymous authentication and theme
              constants.
            </Subtitle>
            <UserInfo>
              <strong>User ID:</strong> {user?.uid || "Not authenticated"}
              <br />
              <strong>Page ID:</strong> {pageId || "Not available"}
              <br />
              <strong>Auth Method:</strong>{" "}
              {user?.isAnonymous ? "Anonymous" : "Custom Token"}
              <br />
              <strong>Links Count:</strong> {links.length}
              <br />
              <strong>Data Status:</strong>{" "}
              {dataLoading ? "Loading..." : pageData ? "Loaded" : "Not loaded"}
            </UserInfo>
            <ThemePreview>
              <ColorSwatch color={THEME_COLORS.primary}>Primary</ColorSwatch>
              <ColorSwatch color={THEME_COLORS.secondary}>
                Secondary
              </ColorSwatch>
            </ThemePreview>
          </WelcomeMessage>
        )}

        {/* Claim Page Modal */}
        <ClaimPageModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onClaimSuccess={handleClaimPage}
        />

        {/* Complete/Sign-in Modal */}
        <ClaimPageModal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          onClaimSuccess={handleClaimPage}
        />
      </ContentContainer>
    </AppContainer>
  );
}
