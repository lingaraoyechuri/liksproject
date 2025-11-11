"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { THEME_COLORS } from "@/lib/theme/constants";

const UrlDisplayContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 100%;
  min-width: 0;

  &:hover {
    .url-username {
      text-decoration: underline;
      color: ${THEME_COLORS.primary};
    }
  }

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.125rem 0;
    width: 100%;
    justify-content: center;
  }
`;

const UrlDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  letter-spacing: -0.01em;
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    gap: 0.125rem;
  }
`;

const UsernameSpan = styled.span`
  color: #1e293b;
  transition: color 0.2s ease;
  min-width: 1ch;
  display: inline-block;
`;

const UsernameInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: ${THEME_COLORS.primary};
  padding: 0;
  margin: 0;
  min-width: 4ch;
  max-width: 20ch;
  letter-spacing: -0.01em;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    max-width: 15ch;
    min-width: 3ch;
  }
`;

const UrlSuffix = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CopyIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0.6;

  &:hover:not(:disabled) {
    color: ${THEME_COLORS.primary};
    opacity: 1;
    background: rgba(255, 140, 66, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
    transition: transform 0.2s;
  }
`;

interface ShareableUrlDisplayProps {
  url: string;
  slug?: string;
  onSlugChange?: (slug: string) => void;
  onCheckAvailability?: (
    slug: string
  ) => Promise<{ available: boolean; suggestions?: string[] }>;
  onSaveSlug?: (slug: string) => Promise<void>;
  disabled?: boolean;
}

// Copy icon SVG
const CopyIcon = ({ copied }: { copied: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {copied ? (
      <>
        <path d="M20 6L9 17l-5-5" />
      </>
    ) : (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    )}
  </svg>
);

export default function ShareableUrlDisplay({
  url,
  slug,
  onSlugChange,
  onCheckAvailability,
  onSaveSlug,
  disabled = false,
}: ShareableUrlDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize and update input value from slug prop or URL
  // Only update if not currently editing (to avoid overwriting user input)
  useEffect(() => {
    if (!isEditing) {
      const newValue =
        slug !== undefined
          ? slug || ""
          : url
              .replace("https://linkstudio.me/", "")
              .replace("https://", "")
              .split("/")[1] || "";
      setInputValue(newValue);
    }
  }, [slug, url, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Normalize slug input
  const normalizeSlug = (value: string): string => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/[-_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeSlug(e.target.value);
    setInputValue(normalized);

    // Update Zustand immediately as user types
    if (onSlugChange) {
      onSlugChange(normalized);
    }
  };

  // Handle save on blur
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't save if clicking on the copy button
    const relatedTarget = (e as any).relatedTarget;
    if (relatedTarget && relatedTarget.closest("button")) {
      return;
    }

    const normalized = normalizeSlug(inputValue);
    setInputValue(normalized);
    setIsEditing(false);

    // Save to Zustand
    if (onSlugChange) {
      onSlugChange(normalized);
    }

    // Save to Firebase
    if (onSaveSlug) {
      try {
        await onSaveSlug(normalized);
        console.log("✅ Username saved:", normalized);
      } catch (err) {
        console.error("❌ Failed to save username:", err);
      }
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur(); // Trigger blur which will save
    } else if (e.key === "Escape") {
      e.preventDefault();
      // Reset to original value
      const originalValue =
        slug !== undefined
          ? slug || ""
          : url
              .replace("https://linkstudio.me/", "")
              .replace("https://", "")
              .split("/")[1] || "";
      setInputValue(originalValue);
      setIsEditing(false);
    }
  };

  // Handle copy
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentSlug = inputValue || slug || "";
    const fullUrl = currentSlug ? `https://linkstudio.me/${currentSlug}` : url;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Display value
  const displayValue = inputValue || slug || "";

  return (
    <UrlDisplayContainer
      onClick={() => !isEditing && !disabled && setIsEditing(true)}
    >
      <UrlDisplay>
        <UrlSuffix>linkstudio.me/</UrlSuffix>
        {isEditing ? (
          <UsernameInput
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="username"
            disabled={disabled}
          />
        ) : (
          <UsernameSpan className="url-username">
            {displayValue || "your-username"}
          </UsernameSpan>
        )}
      </UrlDisplay>
      <CopyIconButton
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy URL"}
        disabled={disabled}
      >
        <CopyIcon copied={copied} />
      </CopyIconButton>
    </UrlDisplayContainer>
  );
}
