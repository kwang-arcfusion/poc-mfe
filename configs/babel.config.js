// /babel.config.js
module.exports = {
  presets: [
    // 1. Runs 3rd: transpile modern JS to target browsers
    ['@babel/preset-env', { targets: 'defaults' }],

    // 2. Runs 2nd: transform React JSX into JavaScript
    ['@babel/preset-react', { runtime: 'automatic' }],

    // 3. Runs 1st: strip TypeScript types first
    ['@babel/preset-typescript'],
  ],
};
