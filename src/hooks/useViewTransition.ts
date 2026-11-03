import { startTransition, useCallback } from 'react';

/**
 * Custom hook integrating React 19 `startTransition` with the Browser View Transitions API (`document.startViewTransition`).
 *
 * Feature Highlights:
 * 1. Coordinates DOM snapshotting and shared-element morphing during tab/route navigation.
 * 2. Wraps state updates in `startTransition` for concurrent UI responsiveness.
 * 3. Graceful fallback when the View Transitions API is unsupported by older browsers.
 */
export function useViewTransition() {
  const isSupported =
    typeof document !== 'undefined' && 'startViewTransition' in document;

  const navigateWithTransition = useCallback((callback: () => void) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // 1. Native View Transitions Snapshot
      document.startViewTransition(() => {
        // 2. React 19 concurrent transition
        startTransition(() => {
          callback();
        });
      });
    } else {
      // Fallback for browsers without View Transitions
      startTransition(() => {
        callback();
      });
    }
  }, []);

  return {
    navigateWithTransition,
    isSupported,
  };
}
