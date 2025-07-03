import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    tailwindcss,
    autoprefixer,
    cssnano
  ]
};

export default config;
