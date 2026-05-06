// src/network/apiClient.ts
import { BASE_URL } from '../helper/connectionStrings';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
}

export const apiRequest = async (endpoint: string, options: RequestOptions = { method: 'GET' }) => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Centralized Error Handling
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || 'Something went wrong';

      switch (response.status) {
        case 400:
          throw new Error(`Bad Request: ${message}`);
        case 401:
          // Optional: handle auto-logout here
          localStorage.removeItem('token');
          window.location.reload(); 
          throw new Error('Unauthorized. Please login again.');
        case 403:
          throw new Error('Forbidden: You do not have permission.');
        case 404:
          throw new Error('Resource not found.');
        case 500:
          throw new Error('Internal Server Error. Please try later.');
        default:
          throw new Error(message);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};