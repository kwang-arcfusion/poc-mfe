import './styles.css';

(async () => {
  // @ts-ignore
  await __webpack_init_sharing__('default');

  const React = (await import('react')).default;
  const { createRoot } = await import('react-dom/client');
  const Home = (await import('./Home')).default;

  const root = document.getElementById('root')!;
  createRoot(root).render(React.createElement(Home));
})();
