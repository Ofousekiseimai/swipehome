import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'currentUser';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const storedUser = window.localStorage.getItem(STORAGE_KEY);

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        let existingUser = null;

        if (parsed.type === 'owner') {
          existingUser = await api.getOwnerById(parsed.id);
        } else if (parsed.type === 'seeker') {
          existingUser = await api.getSeekerById(parsed.id);
        } else if (parsed.type === 'admin') {
          existingUser = await api.getAdminById(parsed.id);
        }

        if (existingUser && isMounted) {
          const { password: _password, ...safeUser } = existingUser;
          setCurrentUser({ ...safeUser, type: parsed.type });
        } else if (isMounted) {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch (bootstrapError) {
        console.error('Failed to restore session', bootstrapError);
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password, allowedTypes = null) => {
    setError(null);
    try {
      const user = await api.login({ email, password });

      if (allowedTypes && !allowedTypes.includes(user.type)) {
        throw new Error('Δεν έχετε δικαιώματα πρόσβασης για αυτή την ενότητα');
      }

      setCurrentUser(user);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (loginError) {
      console.error('Login failed', loginError);
      setError(loginError.message);
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
