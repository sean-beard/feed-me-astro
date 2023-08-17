import { useEffect } from "react";

export const ThemeInitializer = () => {
  useEffect(() => {
    const prefersDarkTheme = localStorage.getItem("prefersDarkTheme");

    if (prefersDarkTheme) {
      document.body.classList.add("dark-theme");
    }
  }, []);

  return null;
};
