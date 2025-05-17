// Polyfills for browser environment when using Node.js libraries

// Define global for socket.io-client and other libraries
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  window.process = window.process || { env: {} };
}

// This is executed immediately when imported
console.log('Browser polyfills initialized');

export default {};