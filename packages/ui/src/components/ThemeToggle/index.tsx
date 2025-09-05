import React from 'react';
import { Button } from '@fluentui/react-components';
import { WeatherSunny24Regular, WeatherMoon24Regular } from '@fluentui/react-icons';
import { useThemeStore } from '@arcfusion/store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      appearance="transparent"
      icon={theme === 'dark' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  );
}
