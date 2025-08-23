// packages/ui/src/theme/arcfusionThemes.ts
import { webLightTheme, webDarkTheme, type Theme } from '@fluentui/react-components';

// สร้าง Light theme ของเราเองโดยมี Sarabun เป็น font หลัก
export const arcusionLightTheme: Theme = {
  ...webLightTheme,
  fontFamilyBase: "'Sarabun', sans-serif",
  // ในอนาคตถ้าต้องการ override สีหลักของแบรนด์ ก็มาแก้ที่นี่
  // colorBrandBackground: '#0067c0',
};

// สร้าง Dark theme ของเราเองโดยมี Sarabun เป็น font หลัก
export const arcusionDarkTheme: Theme = {
  ...webDarkTheme,
  fontFamilyBase: "'Sarabun', sans-serif",
};
