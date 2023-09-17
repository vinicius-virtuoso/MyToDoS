"use client";

import {
  ReactNode,
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";

interface ThemeContext {
  toggleTheme: () => void;
  theme: string;
}

const ThemeContext = createContext({} as ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(() => {
    const theme_app = localStorage.getItem("theme_app_todo");
    return theme_app ? theme_app : "light";
  });

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme_app_todo", "dark");
    }
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme_app_todo", "light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
