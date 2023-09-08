import { useEffect, useState } from "react";
import "./styles.css";

export const ThemeToggle = () => {
  const [lightThemeEnabled, setLightThemeEnabled] = useState(
    localStorage.getItem("prefersDarkTheme") === null,
  );

  useEffect(() => {
    setTheme(lightThemeEnabled);
  }, []);

  const setTheme = (isLightThemeEnabled: boolean) => {
    if (isLightThemeEnabled) {
      localStorage.removeItem("prefersDarkTheme");
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
      localStorage.setItem("prefersDarkTheme", "true");
    }
  };

  const handleThemeToggle: React.ChangeEventHandler<HTMLInputElement> = () => {
    const isLightThemeEnabled = !lightThemeEnabled;

    setTheme(isLightThemeEnabled);

    setLightThemeEnabled(isLightThemeEnabled);
  };

  return (
    <div className="theme-toggle switch">
      <label>
        🌛
        <input
          id="toggle"
          type="checkbox"
          checked={lightThemeEnabled}
          onChange={handleThemeToggle}
        />
        <span className="lever" />
        🌤️
      </label>
    </div>
  );
};
