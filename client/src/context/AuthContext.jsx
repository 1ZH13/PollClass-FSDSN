import { createContext, useEffect, useState } from 'react';
import { auth } from '../services/auth.js';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(auth.getUser());

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}
