'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'night',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('night');
  const [mounted, setMounted] = useState(false);

  // On mount, read saved preference or default to 'night'
  useEffect(() => {
    const saved = localStorage.getItem('catshop-theme') || 'night';
    setTheme(saved);
    setMounted(true);
  }, []);

  // Apply data-theme to <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('catshop-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'night' ? 'light' : 'night'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
