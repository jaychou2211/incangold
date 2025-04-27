import js from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const languageOptions = {
  parser: tseslint.parser,
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: import.meta.dirname,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    ...globals.node,
    ...globals.es2021,
  }
};

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
    rules: {
      semi: 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions,
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    }
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.test.ts'],
    languageOptions: {
      ...languageOptions,
      globals: {
        ...languageOptions.globals,
        ...globals.vitest,
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    }
  },
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'unknown'],
          'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        },
      ],
    },
  },
];