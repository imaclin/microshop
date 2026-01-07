// Polyfill for any other web-specific issues
if (typeof window !== 'undefined') {
  window.global = window;
}
