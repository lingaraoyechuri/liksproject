import { create } from "zustand";

interface CustomLink {
  id: string;
  text: string;
  url: string;
}

interface FlowState {
  // Step management
  currentStep: number;
  linkEditorStep: number;

  // Username from landing page
  username: string;

  // Platform selection
  selectedPlatforms: string[];
  platformLinks: Record<string, string>;

  // Custom links
  customLinks: CustomLink[];

  // Profile form data (shared across all layouts)
  profileFormData: Record<string, any>;

  // UI state
  showTheme: boolean;
  hasStarted: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setLinkEditorStep: (step: number) => void;
  setUsername: (username: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setPlatformLinks: (links: Record<string, string>) => void;
  updatePlatformLink: (platformId: string, value: string) => void;
  setCustomLinks: (links: CustomLink[]) => void;
  addCustomLink: (link: CustomLink) => void;
  updateCustomLink: (id: string, updates: Partial<CustomLink>) => void;
  removeCustomLink: (id: string) => void;
  setProfileFormData: (data: Record<string, any>) => void;
  updateProfileFormData: (data: Partial<Record<string, any>>) => void;
  setShowTheme: (show: boolean) => void;
  setHasStarted: (started: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  linkEditorStep: 1,
  username: "",
  selectedPlatforms: [],
  platformLinks: {},
  customLinks: [],
  profileFormData: {},
  showTheme: false,
  hasStarted: false,
};

export const useFlowStore = create<FlowState>()((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  setLinkEditorStep: (step) => set({ linkEditorStep: step }),

  setUsername: (username) => set({ username }),

  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),

  setPlatformLinks: (links) => set({ platformLinks: links }),

  updatePlatformLink: (platformId, value) =>
    set((state) => ({
      platformLinks: {
        ...state.platformLinks,
        [platformId]: value,
      },
    })),

  setCustomLinks: (links) => set({ customLinks: links }),

  addCustomLink: (link) =>
    set((state) => ({
      customLinks: [...state.customLinks, link],
    })),

  updateCustomLink: (id, updates) =>
    set((state) => ({
      customLinks: state.customLinks.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      ),
    })),

  removeCustomLink: (id) =>
    set((state) => ({
      customLinks: state.customLinks.filter((link) => link.id !== id),
    })),

  setProfileFormData: (data) => set({ profileFormData: data }),

  updateProfileFormData: (data) =>
    set((state) => ({
      profileFormData: { ...state.profileFormData, ...data },
    })),

  setShowTheme: (show) => set({ showTheme: show }),

  setHasStarted: (started) => set({ hasStarted: started }),

  reset: () => set(initialState),
}));
