// ห้ามมี JSX / ห้าม import React top-level
import './styles.css';

(async () => {
  // init share scope ก่อน
  // @ts-ignore
  await __webpack_init_sharing__('default');

  const React = (await import('react')).default;
  const { createRoot } = await import('react-dom/client');
  const Header = (await import('./Header')).default; // ใช้ "ตัวเดียวกับที่ expose"

  const root = document.getElementById('root')!;
  createRoot(root).render(React.createElement(Header));
})();
