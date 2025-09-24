// packages/ui/src/theme/arcfusionThemes.ts
import { webLightTheme, webDarkTheme, type Theme } from '@fluentui/react-components';

// Create our custom Light theme with Poppins as the base font
export const arcusionLightTheme: Theme = {
  ...webLightTheme,
  fontFamilyBase: "'Poppins', sans-serif",
  // In the future, if you want to override brand colors, change here
  // colorBrandBackground: '#0067c0',
};

// Create our custom Dark theme with Poppins as the base font
export const arcusionDarkTheme: Theme = {
  ...webDarkTheme,
  fontFamilyBase: "'Poppins', sans-serif",
};
