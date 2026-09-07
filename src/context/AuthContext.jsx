import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();
const SESSION_KEY = 'biteexpress-session';
const TOKEN_KEY   = 'biteexpress-token';

/**
 * Normalise a user object coming from any backend response shape.
 * The backend always returns { id, name, email, role, accountStatus, ... }
 * but some older code paths may use _id. We keep both so nothing breaks.
 */
const normaliseUser = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const id = raw.id || raw._id;
  return { ...raw, id: String(id), _id: String(id) };
};

export const AuthProvider = ({ children }) => {
  const [user,    setUserState] = useState(() => {
    const saved = window.localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    try { return JSON.parse(saved); } catch { window.localStorage.removeItem(SESSION_KEY); return null; }
  });
  const [loading, setLoading] = useState(true);

  /* Re-validate the stored token on mount */
  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) { queueMicrotask(() => setLoading(false)); return; }

    authService.getProfile()
      .then((profile) => {
        // apiRequest unwraps .data, so profile IS the user object already
        const fresh = normaliseUser(profile?.user || profile);
        if (fresh) {
          setUserState(fresh);
          window.localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
        }
      })
      .catch(() => {
        // Token invalid or expired — clear session
        window.localStorage.removeItem(SESSION_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        setUserState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Persist a user + token to state and localStorage.
   * Called with (null, null) on logout.
   */
  const persistSession = (nextUser, token) => {
    if (nextUser) {
      const normalised = normaliseUser(nextUser);
      setUserState(normalised);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(normalised));
    } else {
      setUserState(null);
      window.localStorage.removeItem(SESSION_KEY);
    }
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  };

  /**
   * Login: POST /auth/login
   * Backend returns { success, data: { token, user } }
   * apiRequest unwraps .data → we receive { token, user }
   */
  const login = async ({ email, password } = {}) => {
    const response = await authService.login({ email, password });
    // response is { token, user } after apiRequest unwrapping
    const token    = response?.token;
    const userData = normaliseUser(response?.user || response);
    persistSession(userData, token);
    return userData;
  };

  /**
   * Register: POST /auth/register
   * Same response shape as login.
   */
  const register = async ({ name, email, password, role = 'customer', phone = '', address = '' } = {}) => {
    const response = await authService.register({ name, email, password, role, phone, address });
    const token    = response?.token;
    const userData = normaliseUser(response?.user || response);
    persistSession(userData, token);
    return userData;
  };

  const requestPasswordReset = async (email)            => authService.requestPasswordReset(email);
  const verifyEmail          = async (token)             => authService.verifyEmail(token);
  const resetPassword        = async ({ token, password }) => authService.resetPassword({ token, password });

  const logout = () => persistSession(null, null);

  /**
   * setUser — used by profile pages to update the in-memory user
   * without touching the token.
   */
  const setUser = (updates) => {
    const merged = normaliseUser({ ...user, ...updates });
    setUserState(merged);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      setUser,
      requestPasswordReset,
      verifyEmail,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
