"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import LinkPreview from "@/components/LinkPreview";
import { LinkPageData, Theme } from "@/types";
import { getPageDataPath } from "@/lib/firebase/utils";
import styled from "styled-components";
import { THEME_COLORS } from "@/lib/theme/constants";

// Import THEMES array (same as in App.tsx)
const THEMES: Theme[] = [
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
    primary: "#FF6B6B",
    secondary: "#1ECBA1",
    bg: "#FFFFFF",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    primary: "#3B82F6",
    secondary: "#06B6D4",
    bg: "#F0F9FF",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    primary: "#F97316",
    secondary: "#FB923C",
    bg: "#FFF7ED",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    primary: "#10B981",
    secondary: "#34D399",
    bg: "#F0FDF4",
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    primary: "#8B5CF6",
    secondary: "#A78BFA",
    bg: "#FAF5FF",
  },
];

const PublicPageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
`;

const BrandLogo = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    right: auto;
    gap: 0;
  }
`;

const BrandIcon = styled.div`
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

const BrandText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
  background: linear-gradient(
    135deg,
    ${THEME_COLORS.primary} 0%,
    ${THEME_COLORS.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: #525252;
  min-height: 100vh;
  width: 100%;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #1ecba1;
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

const ErrorContainer = styled.div`
  max-width: 32rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

export default function PublicPage() {
  const params = useParams();
  const slugOrPageId = params?.pageId as string;
  const [pageData, setPageData] = useState<LinkPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrPageId || !db) {
      setError("Invalid page ID");
      setLoading(false);
      return;
    }

    // First, try to find by slug, then fall back to pageId
    const findPageBySlugOrId = async () => {
      if (!db) {
        setError("Database not initialized");
        setLoading(false);
        return () => {};
      }

      try {
        // Get the app ID to construct the collection path
        const appId =
          typeof window !== "undefined" && (window as any).__app_id
            ? (window as any).__app_id
            : process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "default-app-id";

        const collectionPath = `artifacts/${appId}/public/data/links`;
        const pagesRef = collection(db, collectionPath);

        // Try to find by slug first
        const slugQuery = query(pagesRef, where("slug", "==", slugOrPageId));
        const slugSnapshot = await getDocs(slugQuery);

        if (!slugSnapshot.empty) {
          // Found by slug
          const docData = slugSnapshot.docs[0].data() as LinkPageData;
          setPageData(docData);
          setLoading(false);
          setError(null);

          // Set up real-time listener for this document
          const docRef = doc(db, slugSnapshot.docs[0].ref.path);
          return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as LinkPageData;
              setPageData(data);
            }
          });
        } else {
          // Not found by slug, try by pageId (fallback for old URLs)
          const docPath = getPageDataPath(slugOrPageId);
          const docRef = doc(db, docPath);

          const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data() as LinkPageData;
                setPageData(data);
                setLoading(false);
                setError(null);
              } else {
                setError("Page not found");
                setLoading(false);
              }
            },
            (err: any) => {
              console.error("Error loading page:", err);

              // Provide helpful error message for permission errors
              if (
                err?.code === "permission-denied" ||
                err?.message?.includes("permission")
              ) {
                setError(
                  "Permission denied. Please check your Firestore security rules. See docs/firestore-rules.md for setup instructions."
                );
              } else {
                setError(err.message || "Failed to load page");
              }
              setLoading(false);
            }
          );

          return unsubscribe;
        }
      } catch (err: any) {
        console.error("Error finding page:", err);
        setError(err.message || "Failed to load page");
        setLoading(false);
        return () => {}; // Return empty unsubscribe function
      }
    };

    const unsubscribePromise = findPageBySlugOrId();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [slugOrPageId]);

  // Get current theme
  const currentTheme: Theme = pageData?.themeId
    ? THEMES.find((theme) => theme.id === pageData.themeId) || THEMES[0]
    : THEMES[0];

  const handleBrandClick = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <PublicPageContainer>
        <BrandLogo onClick={handleBrandClick}>
          <BrandIcon>LS</BrandIcon>
          <BrandText>LinkStudio</BrandText>
        </BrandLogo>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading page...</LoadingText>
        </LoadingContainer>
      </PublicPageContainer>
    );
  }

  if (error || !pageData) {
    return (
      <PublicPageContainer>
        <BrandLogo onClick={handleBrandClick}>
          <BrandIcon>LS</BrandIcon>
          <BrandText>LinkStudio</BrandText>
        </BrandLogo>
        <ErrorContainer>
          <ErrorTitle>Page Not Found</ErrorTitle>
          <ErrorText>
            {error || "The page you are looking for does not exist."}
          </ErrorText>
        </ErrorContainer>
      </PublicPageContainer>
    );
  }

  return (
    <PublicPageContainer>
      <BrandLogo onClick={handleBrandClick}>
        <BrandIcon>LS</BrandIcon>
        <BrandText>LinkStudio</BrandText>
      </BrandLogo>
      <LinkPreview
        links={pageData.links || []}
        user={null} // Public view, no user context
        currentTheme={currentTheme}
        layoutId={pageData.layoutId || "creator-classic"}
        profileData={pageData.profileData} // Pass profile data (name, bio, profilePic, etc.)
        onLinkClick={(linkId) => {
          // Track clicks in public view (could update Firestore here)
          console.log("Link clicked in public view:", linkId);
        }}
      />
    </PublicPageContainer>
  );
}
