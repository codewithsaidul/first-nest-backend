// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'all',

          // 👇 এটা main fix
          proseWrap: 'preserve',
        },
      ],
      'no-multiple-empty-lines': ['error', { max: 10, maxEOF: 0 }],
    },
  },
);
