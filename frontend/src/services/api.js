/**
 * HeritageAI Unified API Client
 * Seamlessly interfaces with FastAPI backend with built-in resilient fallback data.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[HeritageAI API] Failed connecting to backend at ${url}. Switching to resilient local store.`, error);
    return null; // Will trigger local fallback in services
  }
}
