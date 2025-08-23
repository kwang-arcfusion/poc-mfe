// packages/ui/src/Button.tsx
import React from 'react';
// Import Button และ Props มาจาก Fluent UI โดยตรง
import {
  Button as FluentButton,
  ButtonProps as FluentButtonProps,
} from '@fluentui/react-components';

// สร้าง Props ของเราเอง โดยอาจจะเพิ่ม variant เข้าไป
export type ButtonProps = FluentButtonProps & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ใช้ props `appearance` ของ FluentButton ในการเปลี่ยนสไตล์
  return <FluentButton appearance={variant === 'primary' ? 'primary' : 'secondary'} {...props} />;
}
