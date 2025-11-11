"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, Theme } from "@/types";
import { THEME_COLORS } from "@/lib/theme/constants";
import { suggestLinkText } from "@/lib/utils/suggestions";
import LayoutForm from "./LayoutForm";
import { useFlowStore } from "@/store/useFlowStore";

const MAX_LINKS = 8;

// Platform definitions with SVG icons
interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  urlPrefix: string;
  placeholder: string;
  color: string;
}

// SVG Icon Components
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm16.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.592.026 11.968.026L12.017 0z" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.592.026 11.968.026L12.017 0z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928-1.793 7.18-1.793 11.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.561.601.3.899 1.02.6 1.621-.3.421-1.02.599-1.621.3z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const WebsiteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.314 2.023c.297-.033.599-.05.905-.05.306 0 .608.017.905.05-1.793 1.478-3.24 3.38-4.19 5.568-.95-2.188-2.397-4.09-4.19-5.568zm-4.19 16.954c1.793-1.478 3.24-3.38 4.19-5.568.95 2.188 2.397 4.09 4.19 5.568-.297.033-.599.05-.905.05-.306 0-.608-.017-.905-.05zm9.508 0c1.793-1.478 3.24-3.38 4.19-5.568.95 2.188 2.397 4.09 4.19 5.568-.297.033-.599.05-.905.05-.306 0-.608-.017-.905-.05zM2.023 12c0-.306.017-.608.05-.905 1.478 1.793 3.38 3.24 5.568 4.19-2.188.95-4.09 2.397-5.568 4.19-.033-.297-.05-.599-.05-.905zm19.954 0c0 .306-.017.608-.05.905-1.478-1.793-3.38-3.24-5.568-4.19 2.188-.95 4.09-2.397 5.568-4.19.033.297.05.599.05.905zm-9.663 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
  </svg>
);

const OnlyFansIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 3c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5z" />
  </svg>
);

const PatreonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.623 8.64 8.623 4.75 0 8.623-3.873 8.623-8.623C24 4.4 20.136.524 15.386.524M.026 24h4.22V.524H.026V24z" />
  </svg>
);

const KofiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M23.881 8.948c-.796-4.583-4.702-8.18-9.466-8.18-5.197 0-9.415 4.223-9.415 9.415 0 2.769 1.201 5.251 3.105 6.979l-.839 2.773 2.839-.789c1.17.324 2.404.502 3.68.502 5.197 0 9.415-4.223 9.415-9.415 0-.33-.021-.651-.059-.969l-.26-1.197zm-6.348 5.386c-.202.584-1.193 1.111-1.787 1.193-.202 0-.404.02-.606.04-.202.02-.404.04-.606.04-.404 0-.808-.04-1.193-.121-.384-.08-.768-.202-1.132-.364-.364-.161-.728-.323-1.051-.525-.323-.202-.606-.444-.869-.687-.263-.242-.485-.525-.687-.808-.202-.283-.364-.606-.485-.95-.121-.343-.202-.687-.242-1.051-.04-.364-.04-.728 0-1.092.04-.364.121-.728.242-1.071.121-.344.283-.667.485-.95.202-.283.424-.566.687-.808.263-.243.545-.485.869-.687.323-.202.687-.364 1.051-.525.364-.162.748-.283 1.132-.364.384-.08.788-.121 1.193-.121.202 0 .404.02.606.04.202.02.404.04.606.04.594.082 1.585.609 1.787 1.193.202.584.04 1.515-.364 2.178-.404.663-1.051 1.313-1.515 1.697-.465.384-1.111.93-1.515 1.313-.404.384-.566 1.595-.364 2.178z" />
  </svg>
);

const BuyMeACoffeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M6.027 14.5c-.5 0-.9.4-.9.9s.4.9.9.9h11.946c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H6.027zm1.1-2.7c-.5 0-.9.4-.9.9s.4.9.9.9h9.746c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H7.127zm-2.2-2.7c-.5 0-.9.4-.9.9s.4.9.9.9h14.146c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H4.927zm15.173-3.6H3.9c-.5 0-.9.4-.9.9v12.6c0 .5.4.9.9.9h16.2c.5 0 .9-.4.9-.9V7.1c0-.5-.4-.9-.9-.9zM20.1 18.6H3.9V8.1h16.2v10.5z" />
  </svg>
);

const SubstackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

const GumroadIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M18.75 0H5.25C2.35 0 0 2.35 0 5.25v13.5C0 21.65 2.35 24 5.25 24h13.5C21.65 24 24 21.65 24 18.75V5.25C24 2.35 21.65 0 18.75 0zm-6.75 18.75c-2.9 0-5.25-2.35-5.25-5.25s2.35-5.25 5.25-5.25 5.25 2.35 5.25 5.25-2.35 5.25-5.25 5.25z" />
  </svg>
);

const EtsyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M8.564 2.445c0-.325.033-.52.59-.52h7.465c.268 0 .52.104.707.29.187.185.29.437.29.707v11.695c0 .268-.104.52-.29.707a1.001 1.001 0 01-.707.29H9.154c-.268 0-.52-.104-.707-.29a1.001 1.001 0 01-.29-.707V8.564c0-.325-.033-.52-.59-.52H5.442c-.325 0-.52.033-.52.59v7.465c0 .268.104.52.29.707.185.187.437.29.707.29h11.695c.268 0 .52-.104.707-.29.186-.185.29-.437.29-.707V5.442c0-.325-.033-.52-.59-.52h-7.465c-.325 0-.52-.033-.52-.59V2.445zm-5.12 16.11c-.268 0-.52-.104-.707-.29a1.001 1.001 0 01-.29-.707V5.442c0-.325.033-.52.59-.52h7.465c.325 0 .52.033.52.59v2.564c0 .325.033.52.59.52h4.222c.325 0 .52-.033.52-.59V5.442c0-.325-.033-.52-.59-.52H3.442c-.325 0-.52-.033-.52-.59V2.445c0-.325.033-.52.59-.52h15.116c.325 0 .52.033.52.59v15.116c0 .325-.033.52-.59.52h-2.564c-.325 0-.52-.033-.52-.59v-4.222c0-.325-.033-.52-.59-.52H9.154c-.325 0-.52-.033-.52-.59v7.465c0 .325-.033.52-.59.52H2.445z" />
  </svg>
);

const AmazonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M16.412 4.412h-4.824v15.176h4.824V4.412zM2 4.588l1.176 1.176v12.471L2 19.412V4.588zm17.176-1.176H7.059v15.176h12.117V3.412z" />
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M15.637 15.637h-7.275v-7.275h7.275v7.275zm-7.275-9.118h7.275V0H8.362v6.519zm9.118 9.118V8.362H24v7.275h-6.519zm0-9.118V0h6.519v6.519h-6.519zM8.362 24h7.275v-6.519H8.362V24zM0 15.637h6.519V8.362H0v7.275zm0-9.118V0h6.519v6.519H0z" />
  </svg>
);

const RedbubbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 4v12h2V6h-2zm4 0v12h2V6h-2z" />
  </svg>
);

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <InstagramIcon />,
    urlPrefix: "https://instagram.com/",
    placeholder: "yourusername",
    color: "#E4405F",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <YouTubeIcon />,
    urlPrefix: "https://youtube.com/@",
    placeholder: "yourchannel",
    color: "#FF0000",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <TikTokIcon />,
    urlPrefix: "https://tiktok.com/@",
    placeholder: "yourusername",
    color: "#000000",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: <WhatsAppIcon />,
    urlPrefix: "https://wa.me/",
    placeholder: "1234567890",
    color: "#25D366",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: <XIcon />,
    urlPrefix: "https://x.com/",
    placeholder: "yourusername",
    color: "#000000",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FacebookIcon />,
    urlPrefix: "https://facebook.com/",
    placeholder: "yourpage",
    color: "#1877F2",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <LinkedInIcon />,
    urlPrefix: "https://linkedin.com/in/",
    placeholder: "yourprofile",
    color: "#0A66C2",
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: <TwitchIcon />,
    urlPrefix: "https://twitch.tv/",
    placeholder: "yourusername",
    color: "#9146FF",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: <SnapchatIcon />,
    urlPrefix: "https://snapchat.com/add/",
    placeholder: "yourusername",
    color: "#FFFC00",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: <PinterestIcon />,
    urlPrefix: "https://pinterest.com/",
    placeholder: "yourusername",
    color: "#BD081C",
  },
  {
    id: "discord",
    name: "Discord",
    icon: <DiscordIcon />,
    urlPrefix: "https://discord.gg/",
    placeholder: "yourserver",
    color: "#5865F2",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: <RedditIcon />,
    urlPrefix: "https://reddit.com/user/",
    placeholder: "yourusername",
    color: "#FF4500",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: <SpotifyIcon />,
    urlPrefix: "https://open.spotify.com/user/",
    placeholder: "yourusername",
    color: "#1DB954",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: <TelegramIcon />,
    urlPrefix: "https://t.me/",
    placeholder: "yourusername",
    color: "#0088cc",
  },
  {
    id: "medium",
    name: "Medium",
    icon: <MediumIcon />,
    urlPrefix: "https://medium.com/@",
    placeholder: "yourusername",
    color: "#000000",
  },
  {
    id: "github",
    name: "GitHub",
    icon: <GitHubIcon />,
    urlPrefix: "https://github.com/",
    placeholder: "yourusername",
    color: "#181717",
  },
  {
    id: "onlyfans",
    name: "OnlyFans",
    icon: <OnlyFansIcon />,
    urlPrefix: "https://onlyfans.com/",
    placeholder: "yourusername",
    color: "#00AFF0",
  },
  {
    id: "patreon",
    name: "Patreon",
    icon: <PatreonIcon />,
    urlPrefix: "https://patreon.com/",
    placeholder: "yourusername",
    color: "#FF424D",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    icon: <KofiIcon />,
    urlPrefix: "https://ko-fi.com/",
    placeholder: "yourusername",
    color: "#FF5E5B",
  },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    icon: <BuyMeACoffeeIcon />,
    urlPrefix: "https://buymeacoffee.com/",
    placeholder: "yourusername",
    color: "#FFDD00",
  },
  {
    id: "substack",
    name: "Substack",
    icon: <SubstackIcon />,
    urlPrefix: "https://",
    placeholder: "yourname.substack.com",
    color: "#FF6719",
  },
  {
    id: "gumroad",
    name: "Gumroad",
    icon: <GumroadIcon />,
    urlPrefix: "https://",
    placeholder: "yourname.gumroad.com",
    color: "#36A9AE",
  },
  {
    id: "etsy",
    name: "Etsy",
    icon: <EtsyIcon />,
    urlPrefix: "https://etsy.com/shop/",
    placeholder: "yourshop",
    color: "#F45800",
  },
  {
    id: "amazon",
    name: "Amazon",
    icon: <AmazonIcon />,
    urlPrefix: "https://amazon.com/shop/",
    placeholder: "yourstorefront",
    color: "#FF9900",
  },
  {
    id: "shopify",
    name: "Shopify",
    icon: <ShopifyIcon />,
    urlPrefix: "https://",
    placeholder: "yourstore.myshopify.com",
    color: "#96BF48",
  },
  {
    id: "redbubble",
    name: "Redbubble",
    icon: <RedbubbleIcon />,
    urlPrefix: "https://redbubble.com/people/",
    placeholder: "yourusername",
    color: "#E41321",
  },
  {
    id: "website",
    name: "Website",
    icon: <WebsiteIcon />,
    urlPrefix: "https://",
    placeholder: "yourwebsite.com",
    color: "#6366F1",
  },
];

const EditorContainer = styled.div<{ $isStep4?: boolean }>`
  width: 100%;
  max-width: ${(props) => (props.$isStep4 ? "80rem" : "48rem")};
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const StepContainer = styled.div<{ $isActive: boolean }>`
  display: ${(props) => (props.$isActive ? "flex" : "none")};
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StepHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StepTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

// Step 1: Platform Selection
const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
`;

const PlatformCard = styled.button<{
  $isSelected: boolean;
  $platformColor: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0.75rem;
  background-color: #ffffff;
  border: 2px solid
    ${(props) => (props.$isSelected ? props.$platformColor : "#e5e7eb")};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.$isSelected
      ? `0 4px 12px ${props.$platformColor}30`
      : "0 2px 4px rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) =>
      props.$isSelected
        ? `0 6px 16px ${props.$platformColor}40`
        : "0 4px 8px rgba(0, 0, 0, 0.1)"};
    border-color: ${(props) =>
      props.$isSelected ? props.$platformColor : "#d1d5db"};
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const PlatformIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const PlatformName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
`;

// SelectAllButton removed

// Step 2: Link Input
const LinkInputList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const LinkInputCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
`;

const LinkInputHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const LinkInputIcon = styled.div<{ $platformColor: string }>`
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.$platformColor} 0%,
    ${(props) => props.$platformColor}dd 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LinkInputName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const LinkInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const UrlInputContainer = styled.div`
  display: flex;
  gap: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #d1d5db;
  transition: all 0.2s;

  &:focus-within {
    border-color: ${THEME_COLORS.primary};
    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
  }
`;

const UrlPrefix = styled.span`
  padding: 0.875rem 1rem;
  background-color: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #1f2937;
  background-color: #ffffff;

  &::placeholder {
    color: #9ca3af;
  }
`;

const UrlExample = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.25rem 0 0 0;
  padding-left: 0.5rem;
`;

// Step 3: Custom Links
const CustomLinksSection = styled.div`
  margin-top: 1rem;
`;

const CustomLinksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CustomLinksTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const AddCustomLinkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #ffffff;
  border: 2px dashed ${THEME_COLORS.primary};
  border-radius: 0.5rem;
  color: ${THEME_COLORS.primary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 140, 66, 0.05);
    border-color: ${THEME_COLORS.secondary};
  }
`;

const CustomLinkCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CustomLinkHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DragHandle = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::before {
    content: "⋮⋮";
    font-size: 1rem;
    letter-spacing: -0.2rem;
  }
`;

const CustomLinkInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${THEME_COLORS.primary};
    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const DeleteCustomLinkButton = styled.button`
  padding: 0.5rem;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;

  &:hover {
    background-color: #fecaca;
  }
`;

// Navigation Buttons
const NavigationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const NavButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.875rem 2rem;
  background-color: ${(props) =>
    props.variant === "primary" ? THEME_COLORS.primary : "#ffffff"};
  color: ${(props) => (props.variant === "primary" ? "#ffffff" : "#374151")};
  border: ${(props) =>
    props.variant === "primary" ? "none" : "1px solid #d1d5db"};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.variant === "primary"
      ? "0 4px 12px rgba(255, 140, 66, 0.3)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.variant === "primary"
        ? "0 6px 16px rgba(255, 140, 66, 0.4)"
        : "0 2px 6px rgba(0, 0, 0, 0.15)"};
    background-color: ${(props) =>
      props.variant === "primary" ? THEME_COLORS.secondary : "#f9fafb"};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
`;

// Theme Section (for showOnlyTheme mode)
const ThemeSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const ThemeSectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 1rem;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
`;

interface ThemeButtonProps {
  $isSelected: boolean;
  $primaryColor: string;
}

const ThemeButton = styled.button<ThemeButtonProps>`
  aspect-ratio: 1;
  border: 2px solid
    ${(props) => (props.$isSelected ? props.$primaryColor : "#e5e7eb")};
  border-radius: 0.5rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.$primaryColor} 0%,
    ${(props) => props.$primaryColor} 100%
  );
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  box-shadow: ${(props) =>
    props.$isSelected
      ? `0 0 0 3px ${props.$primaryColor}40, 0 2px 8px ${props.$primaryColor}30`
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$isSelected
        ? `0 0 0 3px ${props.$primaryColor}40, 0 4px 12px ${props.$primaryColor}40`
        : "0 2px 6px rgba(0, 0, 0, 0.15)"};
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${(props) => props.$primaryColor} 0%,
      ${(props) => props.$primaryColor} 100%
    );
    border-radius: 0.375rem;
  }
`;

const ThemeButtonInner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
`;

const ThemeName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 0.25rem;
`;

interface LinkEditorProps {
  links: Link[];
  onUpdateLinks: (links: Link[]) => void;
  themes: Theme[];
  currentTheme: Theme;
  onThemeChange: (themeId: string) => void;
  showOnlyTheme?: boolean;
  hideTheme?: boolean;
  layoutId?: string;
  user?: any;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  onProfileDataChange?: (data: Record<string, any>) => void; // For saving profile data to Firebase
}

export default function LinkEditor({
  links,
  onUpdateLinks,
  themes,
  currentTheme,
  onThemeChange,
  showOnlyTheme = false,
  hideTheme = false,
  layoutId,
  user,
  onStepChange,
  onComplete,
  onProfileDataChange,
}: LinkEditorProps) {
  // Use Zustand store for flow state
  const {
    currentStep,
    selectedPlatforms,
    platformLinks,
    customLinks,
    profileFormData,
    setCurrentStep,
    setSelectedPlatforms,
    setPlatformLinks,
    updatePlatformLink,
    setCustomLinks,
    addCustomLink,
    updateCustomLink,
    removeCustomLink,
    setProfileFormData,
    updateProfileFormData,
  } = useFlowStore();

  // Initialize from existing links - only run once on mount
  // Only initialize if Zustand store is empty (hasn't been initialized yet)
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Only initialize once, and only if:
    // 1. We haven't initialized yet
    // 2. We have links from props
    // 3. Zustand store is empty (no platforms selected yet)
    if (
      hasInitializedRef.current ||
      links.length === 0 ||
      selectedPlatforms.length > 0 ||
      customLinks.length > 0
    ) {
      return;
    }

    // Parse existing links to determine selected platforms and custom links
    const platforms: string[] = [];
    const platformData: Record<string, string> = {};
    const custom: Array<{ id: string; text: string; url: string }> = [];

    links.forEach((link) => {
      const platform = PLATFORMS.find((p) => link.url.startsWith(p.urlPrefix));
      if (platform) {
        if (!platforms.includes(platform.id)) {
          platforms.push(platform.id);
        }
        platformData[platform.id] = link.url.replace(platform.urlPrefix, "");
      } else {
        custom.push({
          id: link.id,
          text: link.text,
          url: link.url,
        });
      }
    });

    // Only update if we found platforms or custom links
    if (platforms.length > 0 || custom.length > 0) {
      setSelectedPlatforms(platforms);
      setPlatformLinks(platformData);
      setCustomLinks(custom);
      hasInitializedRef.current = true;
    }
  }, [links, selectedPlatforms.length, customLinks.length]);

  // Sync with parent when links change - use ref to track previous values and avoid unnecessary updates
  const prevLinksRef = useRef<string>("");

  useEffect(() => {
    // Don't sync if we haven't initialized yet (still loading from props)
    if (!hasInitializedRef.current) return;

    const allLinks: Link[] = [];

    // Add platform links - only include platforms that have usernames
    selectedPlatforms.forEach((platformId) => {
      const platform = PLATFORMS.find((p) => p.id === platformId);
      const username = platformLinks[platformId]?.trim();
      if (platform && username) {
        allLinks.push({
          id: `platform-${platformId}`,
          text: platform.name,
          url: `${platform.urlPrefix}${username}`,
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

    // Create a string representation to compare
    const linksKey = JSON.stringify(
      allLinks.map((l) => ({ id: l.id, text: l.text, url: l.url }))
    );

    // Only update if links actually changed
    // Also check if the current links prop matches what we're about to send (avoid loop)
    const currentLinksKey = JSON.stringify(
      links.map((l) => ({ id: l.id, text: l.text, url: l.url }))
    );

    // Only call onUpdateLinks if:
    // 1. Links actually changed
    // 2. We've initialized (to avoid overwriting during initialization)
    // 3. Links don't match what we're about to send (avoid loop)
    // Note: We don't require allLinks.length > 0 because empty links array is valid
    if (linksKey !== prevLinksRef.current && linksKey !== currentLinksKey) {
      prevLinksRef.current = linksKey;
      onUpdateLinks(allLinks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatforms, platformLinks, customLinks, onUpdateLinks]); // Don't include links to avoid loop

  const handlePlatformToggle = (platformId: string) => {
    const isSelected = selectedPlatforms.includes(platformId);
    if (isSelected) {
      setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  // handleSelectAll removed

  const handlePlatformLinkChange = (platformId: string, value: string) => {
    updatePlatformLink(platformId, value);
  };

  const handleAddCustomLink = () => {
    addCustomLink({
      id: `custom-${Date.now()}`,
      text: "",
      url: "",
    });
  };

  const handleCustomLinkChange = (
    id: string,
    field: "text" | "url",
    value: string
  ) => {
    updateCustomLink(id, { [field]: value });
  };

  const handleDeleteCustomLink = (id: string) => {
    removeCustomLink(id);
  };

  // Notify parent when step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  // Sync linkEditorStep in store when currentStep changes
  useEffect(() => {
    useFlowStore.getState().setLinkEditorStep(currentStep);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 1 && selectedPlatforms.length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // If showOnlyTheme, just show theme selection
  if (showOnlyTheme) {
    return (
      <EditorContainer $isStep4={false}>
        <ThemeSection>
          <ThemeSectionTitle>Choose Theme</ThemeSectionTitle>
          <ThemeGrid>
            {themes.map((theme) => (
              <ThemeButton
                key={theme.id}
                $isSelected={theme.id === currentTheme.id}
                $primaryColor={theme.primary}
                onClick={() => onThemeChange(theme.id)}
                title={theme.name}
              >
                <ThemeButtonInner
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  }}
                >
                  <ThemeName>{theme.name}</ThemeName>
                </ThemeButtonInner>
              </ThemeButton>
            ))}
          </ThemeGrid>
        </ThemeSection>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer $isStep4={currentStep === 4}>
      {/* Step 1: Platform Selection */}
      <StepContainer $isActive={currentStep === 1}>
        <StepHeader>
          <StepTitle>Where can people find you?</StepTitle>
          <StepDescription>
            Select the platforms you want to add to your link page
          </StepDescription>
        </StepHeader>
        <PlatformGrid>
          {PLATFORMS.map((platform) => (
            <PlatformCard
              key={platform.id}
              $isSelected={selectedPlatforms.includes(platform.id)}
              $platformColor={platform.color}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <PlatformIcon>{platform.icon}</PlatformIcon>
              <PlatformName>{platform.name}</PlatformName>
            </PlatformCard>
          ))}
        </PlatformGrid>
        <NavigationFooter>
          <div></div>
          <NavButton
            variant="primary"
            onClick={handleNext}
            disabled={selectedPlatforms.length === 0}
          >
            Next →
          </NavButton>
        </NavigationFooter>
      </StepContainer>

      {/* Step 2: Link Input */}
      <StepContainer $isActive={currentStep === 2}>
        <StepHeader>
          <StepTitle>Add your links</StepTitle>
          <StepDescription>
            Enter your usernames or URLs for each selected platform
          </StepDescription>
        </StepHeader>
        <LinkInputList>
          {selectedPlatforms.map((platformId) => {
            const platform = PLATFORMS.find((p) => p.id === platformId);
            if (!platform) return null;

            return (
              <LinkInputCard key={platformId}>
                <LinkInputHeader>
                  <LinkInputIcon $platformColor={platform.color}>
                    {platform.icon}
                  </LinkInputIcon>
                  <LinkInputName>{platform.name}</LinkInputName>
                </LinkInputHeader>
                <LinkInputGroup>
                  <InputLabel>
                    Your {platform.name}{" "}
                    {platform.id === "website" ? "URL" : "username"}
                  </InputLabel>
                  <UrlInputContainer>
                    <UrlPrefix>{platform.urlPrefix}</UrlPrefix>
                    <UrlInput
                      type="text"
                      placeholder={platform.placeholder}
                      value={platformLinks[platformId] || ""}
                      onChange={(e) =>
                        handlePlatformLinkChange(platformId, e.target.value)
                      }
                    />
                  </UrlInputContainer>
                  <UrlExample>
                    Example: {platform.urlPrefix}
                    {platform.placeholder}
                  </UrlExample>
                </LinkInputGroup>
              </LinkInputCard>
            );
          })}
        </LinkInputList>
        <NavigationFooter>
          <NavButton variant="secondary" onClick={handleBack}>
            ← Back
          </NavButton>
          <NavButton variant="primary" onClick={handleNext}>
            Next →
          </NavButton>
        </NavigationFooter>
      </StepContainer>

      {/* Step 3: Custom Links */}
      <StepContainer $isActive={currentStep === 3}>
        <StepHeader>
          <StepTitle>Want to add a custom link?</StepTitle>
          <StepDescription>
            Add any additional links like your portfolio, blog, or store
          </StepDescription>
        </StepHeader>
        <CustomLinksSection>
          <CustomLinksHeader>
            <CustomLinksTitle>Custom Links</CustomLinksTitle>
            {customLinks.length < MAX_LINKS - selectedPlatforms.length && (
              <AddCustomLinkButton onClick={handleAddCustomLink}>
                + Add Custom Link
              </AddCustomLinkButton>
            )}
          </CustomLinksHeader>
          {customLinks.map((customLink) => (
            <CustomLinkCard key={customLink.id}>
              <CustomLinkHeader>
                <DragHandle />
                <CustomLinkInputs>
                  <TextInput
                    type="text"
                    placeholder="Link label (e.g., My Portfolio)"
                    value={customLink.text}
                    onChange={(e) =>
                      handleCustomLinkChange(
                        customLink.id,
                        "text",
                        e.target.value
                      )
                    }
                  />
                  <TextInput
                    type="url"
                    placeholder="https://example.com"
                    value={customLink.url}
                    onChange={(e) =>
                      handleCustomLinkChange(
                        customLink.id,
                        "url",
                        e.target.value
                      )
                    }
                  />
                </CustomLinkInputs>
                <DeleteCustomLinkButton
                  onClick={() => handleDeleteCustomLink(customLink.id)}
                  title="Delete link"
                >
                  ×
                </DeleteCustomLinkButton>
              </CustomLinkHeader>
            </CustomLinkCard>
          ))}
          {customLinks.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}
            >
              No custom links yet. Click "Add Custom Link" to add one.
            </div>
          )}
        </CustomLinksSection>
        <NavigationFooter>
          <NavButton variant="secondary" onClick={handleBack}>
            ← Back
          </NavButton>
          <NavButton variant="primary" onClick={handleNext}>
            Next →
          </NavButton>
        </NavigationFooter>
      </StepContainer>

      {/* Step 4: Layout Form */}
      {layoutId && (
        <StepContainer $isActive={currentStep === 4}>
          <StepHeader>
            <StepTitle>Complete Your Page</StepTitle>
            <StepDescription>
              Add your profile information to personalize your page
            </StepDescription>
          </StepHeader>
          <LayoutForm
            layoutId={layoutId}
            selectedPlatforms={selectedPlatforms}
            platformLinks={platformLinks}
            links={links}
            user={user}
            currentTheme={currentTheme}
            onFormDataChange={React.useCallback(
              (data: Record<string, any>) => {
                setProfileFormData(data);
                // Also save to Firebase if user is authenticated
                if (onProfileDataChange) {
                  onProfileDataChange(data);
                }
              },
              [setProfileFormData, onProfileDataChange]
            )}
          />
          <NavigationFooter>
            <NavButton variant="secondary" onClick={handleBack}>
              ← Back
            </NavButton>
            <NavButton
              variant="primary"
              onClick={() => {
                // Show sign-in modal to save data
                if (onComplete) {
                  onComplete();
                }
              }}
            >
              Complete
            </NavButton>
          </NavigationFooter>
        </StepContainer>
      )}
    </EditorContainer>
  );
}
