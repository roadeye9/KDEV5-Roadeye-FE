import eslint from '@eslint/js';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  ignores: ['node_modules', 'dist'],
  plugins: {
    react: eslintPluginReact,
    'react-hooks': eslintPluginReactHooks
  },
  rules: {
    'no-unused-vars': 'off'
  }
});
