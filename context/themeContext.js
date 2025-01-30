"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const handleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, handleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
