// src/context/AuthContext.jsx
import { createContext, useState } from 'react';

// Mantra biar Vite linter gak bawel soal Fast Refresh di baris ini
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  });
  
  // Karena sekarang proses ngecek token udah instan, loading-nya kita set false aja
  // dan hapus 'setIsLoading' biar linter gak marah
  const isLoading = false;

  const login = (token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_role', userData.role);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};