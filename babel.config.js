// /babel.config.js
module.exports = {
  presets: [
    // 1. ทำงานเป็นอันดับที่ 3: แปลง JS สมัยใหม่ให้รองรับเบราว์เซอร์เป้าหมาย
    ['@babel/preset-env', { targets: 'defaults' }],

    // 2. ทำงานเป็นอันดับที่ 2: แปลง React JSX ให้เป็น JavaScript
    ['@babel/preset-react', { runtime: 'automatic' }],

    // 3. ทำงานเป็นอันดับที่ 1: แยกและลบ Type ของ TypeScript ออกไปก่อน
    ['@babel/preset-typescript'],
  ],
};
