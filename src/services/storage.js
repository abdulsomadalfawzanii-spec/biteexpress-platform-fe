export const readStorage = (key, fallback) => {
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;
  try { return JSON.parse(saved); } catch { return fallback; }
};

export const writeStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const mockResponse = (value) => Promise.resolve(value);
