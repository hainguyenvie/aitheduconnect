import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a new QueryClient with default options
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Helper function to make API requests
 * @param method HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param path API path (should start with '/')
 * @param data Optional request body for POST/PUT requests
 * @returns Response object
 */
export async function apiRequest(
  method: string,
  path: string,
  data?: any
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies with the request
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  return fetch(path, options);
}

export default queryClient;