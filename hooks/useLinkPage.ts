'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc,
  Firestore
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Link, LinkPageData } from '@/types';
import { getPageDataPath } from '@/lib/firebase/utils';

interface UseLinkPageReturn {
  pageData: LinkPageData | null;
  links: Link[];
  loading: boolean;
  error: string | null;
  updateLinks: (links: Link[]) => void;
  updatePageData: (data: Partial<LinkPageData>) => void;
}

/**
 * Custom hook for managing link page data with real-time sync and autosave
 * 
 * @param pageId - The unique identifier for the page
 * @param user - The authenticated Firebase user
 * @param firestore - The Firestore instance
 * @returns Hook state and update functions
 */
export function useLinkPage(
  pageId: string | null,
  user: User | null,
  firestore: Firestore | null
): UseLinkPageReturn {
  const [pageData, setPageData] = useState<LinkPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialSaveRef = useRef(false);
  const isLocalUpdateRef = useRef(false); // Track if we're doing a local update

  // Get the Firestore document reference
  const getDocRef = useCallback(() => {
    if (!pageId || !firestore) return null;
    const docPath = getPageDataPath(pageId);
    return doc(firestore, docPath);
  }, [pageId, firestore]);

  // Debounced save function
  const saveToFirestore = useCallback(
    async (data: LinkPageData) => {
      const docRef = getDocRef();
      if (!docRef) return;

      try {
        const dataToSave = {
          ...data,
          updatedAt: Date.now(),
        };

        await setDoc(docRef, dataToSave, { merge: true });
        console.log('✅ Autosaved to Firestore:', dataToSave);
      } catch (err: any) {
        console.error('❌ Error saving to Firestore:', err);
        setError(err?.message || 'Failed to save data');
      }
    },
    [getDocRef]
  );

  // Debounced update function (optimized: increased debounce to reduce writes)
  const debouncedSave = useCallback(
    (data: LinkPageData) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for 1200ms (1.2 seconds) - increased for better batching
      debounceTimerRef.current = setTimeout(() => {
        saveToFirestore(data);
      }, 1200);
    },
    [saveToFirestore]
  );

  // Initialize document if it doesn't exist
  const initializeDocument = useCallback(
    async (docRef: ReturnType<typeof doc>) => {
      if (!user || isInitialSaveRef.current) return;

      try {
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          // Create initial document with default values
          const initialData: LinkPageData = {
            pageId: pageId!,
            userId: user.uid,
            links: [], // Links will have clickCount: 0 by default when created
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          await setDoc(docRef, initialData);
          console.log('📄 Created initial document:', initialData);
          isInitialSaveRef.current = true;
        }
      } catch (err: any) {
        console.error('❌ Error initializing document:', err);
        setError(err?.message || 'Failed to initialize document');
      }
    },
    [user, pageId]
  );

  // Real-time listener setup
  useEffect(() => {
    if (!pageId || !user || !firestore) {
      setLoading(false);
      return;
    }

    const docRef = getDocRef();
    if (!docRef) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Initialize document if needed
    initializeDocument(docRef);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as LinkPageData;
          
          // Skip update if we just made a local update (prevent infinite loop)
          if (isLocalUpdateRef.current) {
            console.log('⏭️ Skipping Firestore update (local update in progress)');
            return;
          }
          
          setPageData(data);
          setLoading(false);
          setError(null);
          console.log('📡 Real-time update received:', data);
        } else {
          // Document doesn't exist yet, will be created by initializeDocument
          setLoading(false);
        }
      },
      (err) => {
        console.error('❌ Firestore listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [pageId, user, firestore, getDocRef, initializeDocument]);

  // Update links function - use functional update to avoid dependency on pageData
  const updateLinks = useCallback(
    (newLinks: Link[]) => {
      setPageData((currentPageData) => {
        // If pageData doesn't exist yet, create it (shouldn't happen, but handle it)
        if (!currentPageData) {
          if (!pageId || !user) return null;
          
          const newPageData: LinkPageData = {
            pageId: pageId,
            userId: user.uid,
            links: newLinks,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          isLocalUpdateRef.current = true;
          debouncedSave(newPageData);
          setTimeout(() => {
            isLocalUpdateRef.current = false;
          }, 2000);
          
          return newPageData;
        }

        // Check if links actually changed
        const currentLinksKey = JSON.stringify((currentPageData.links || []).map(l => ({ id: l.id, text: l.text, url: l.url })));
        const newLinksKey = JSON.stringify(newLinks.map(l => ({ id: l.id, text: l.text, url: l.url })));
        
        if (currentLinksKey === newLinksKey) {
          return currentPageData; // No change, return same reference
        }

        const updatedData: LinkPageData = {
          ...currentPageData,
          links: newLinks,
        };

        isLocalUpdateRef.current = true;
        debouncedSave(updatedData);
        // Reset flag after a short delay to allow Firestore update to complete
        setTimeout(() => {
          isLocalUpdateRef.current = false;
        }, 2000);
        
        return updatedData;
      });
    },
    [debouncedSave, pageId, user]
  );

  // Update page data function - use functional update to avoid dependency on pageData
  const updatePageData = useCallback(
    (partialData: Partial<LinkPageData>) => {
      setPageData((currentPageData) => {
        // If pageData doesn't exist yet, create it with the partial data
        // This handles the case where updatePageData is called before pageData is loaded
        if (!currentPageData) {
          if (!pageId || !user) {
            console.warn('⚠️ Cannot update page data: missing pageId or user');
            return null;
          }
          
          const newPageData: LinkPageData = {
            pageId: pageId,
            userId: user.uid,
            links: [],
            ...partialData,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          isLocalUpdateRef.current = true;
          debouncedSave(newPageData);
          setTimeout(() => {
            isLocalUpdateRef.current = false;
          }, 2000);
          
          console.log('📝 Created new pageData with partial data:', partialData);
          return newPageData;
        }

        const updatedData: LinkPageData = {
          ...currentPageData,
          ...partialData,
        };

        isLocalUpdateRef.current = true;
        debouncedSave(updatedData);
        // Reset flag after a short delay to allow Firestore update to complete
        setTimeout(() => {
          isLocalUpdateRef.current = false;
        }, 2000);
        
        console.log('📝 Updated pageData with:', partialData);
        console.log('📝 Full updated data:', updatedData);
        return updatedData;
      });
    },
    [debouncedSave, pageId, user]
  );

  return {
    pageData,
    links: pageData?.links || [],
    loading,
    error,
    updateLinks,
    updatePageData,
  };
}

