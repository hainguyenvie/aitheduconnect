// API client using native fetch
type RequestConfig = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export const api = {
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
    });
    return handleResponse<T>(response);
  },

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
    });
    return handleResponse<T>(response);
  },
}; 