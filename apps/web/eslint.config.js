import baseConfig from '../../eslint.config.js';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        allowDefaultProject: true,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
