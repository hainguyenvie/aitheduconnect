// Polyfill for global in browser environment
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  (window as any).global = window;
}

export {};