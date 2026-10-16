'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/** true after hydration on the client, false during SSR. */
export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function subscribeResize(cb: () => void) {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
}

/** Viewport width <= breakpoint, kept in sync on resize. */
export function useIsMobile(breakpoint = 768): boolean {
  return useSyncExternalStore(
    subscribeResize,
    () => window.innerWidth <= breakpoint,
    () => false,
  );
}

/**
 * The DevSidebar collapsed flag in localStorage. Same-tab writes don't fire
 * `storage` events, so we also poll lightly.
 */
function subscribeSidebar(cb: () => void) {
  const id = setInterval(cb, 250);
  window.addEventListener('storage', cb);
  return () => {
    clearInterval(id);
    window.removeEventListener('storage', cb);
  };
}

function readSidebarCollapsed(): boolean {
  try {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved !== null ? saved === 'true' : true;
  } catch {
    return true;
  }
}

export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribeSidebar, readSidebarCollapsed, () => true);
}
