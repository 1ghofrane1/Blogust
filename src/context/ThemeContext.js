"use client";
import { createContext, useEffect, useState } from "react";

// store & share theme state to be able to change theme
export const ThemeContext = createContext(); // new context obj

// get theme prefrence from localStorage
const getFormLocalStorage = () => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem("theme");
        return value || "light"; // return saved theme or default to light
    }
};
    
// wraps app in ThemeContext.Provider
export const ThemeContextProvider = ({ children }) => {
    // state to track current theme
    // if no theme is saved in localStorage, default to light
    const [theme, setTheme] = useState(() => 
        {return getFormLocalStorage();}  // here to store the theme state
    );

    const toggle = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
      localStorage.setItem("theme", theme);
    }, [theme]
  );

    return <ThemeContext.Provider value={{theme, toggle}}>{children}</ThemeContext.Provider>;
    };