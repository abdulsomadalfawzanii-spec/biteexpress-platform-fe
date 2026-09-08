export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://biteexpress-platform-ba.onrender.com/api').replace(/\/$/, '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const apiRequest = async (endpoint, options = {}) => {
  const token = window.localStorage.getItem('biteexpress-token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
};
