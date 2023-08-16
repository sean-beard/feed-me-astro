import { useState } from "react";
import "./styles.css";

export const ThemeToggle = () => {
  const [notificationToggleEnabled, setNotificationToggleEnabled] =
    useState(false);

  const handleNotificationPreferenceToggle: React.ChangeEventHandler<
    HTMLInputElement
  > = () => {
    document.body.classList.toggle("dark-theme");

    setNotificationToggleEnabled(!notificationToggleEnabled);
  };

  return (
    <div className="theme-toggle switch">
      <label>
        🌛
        <input
          id="toggle"
          type="checkbox"
          checked={notificationToggleEnabled}
          onChange={handleNotificationPreferenceToggle}
        />
        <span className="lever" />
        🌤️
      </label>
    </div>
  );
};
