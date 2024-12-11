import typescriptEslint from '@typescript-eslint/eslint-plugin';
import angularEslintEslintPlugin from '@angular-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/dist', '**/node_modules', '**/*.spec.*'],
  },
  ...compat.extends('plugin:@angular-eslint/recommended', 'plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angularEslintEslintPlugin,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['**/*.ts'],

    rules: {
      'comma-dangle': 'off',

      'keyword-spacing': [
        'error',
        {
          before: true,
        },
      ],

      'no-unreachable': 'error',
      'object-curly-spacing': ['error', 'always'],
      'template-curly-spacing': ['error', 'never'],
      curly: ['error'],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
      ],

      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],

      'max-len': [
        'error',
        {
          code: 120,
          ignoreTemplateLiterals: true,
        },
      ],

      'key-spacing': [
        'error',
        {
          afterColon: true,
        },
      ],

      'arrow-spacing': ['error'],
      'no-multi-spaces': ['error'],
      'comma-spacing': ['error'],
      'import/prefer-default-export': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
        },
      ],
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: [
            'Component',
            'Route',
            'Dialog',
            'Maker',
            'Form',
            'Sidebar',
            'Editor',
            'Element',
            'Tool',
            'ElementUi',
            'Renderer',
            'Input',
            'Control',
            'Viewer',
          ],
        },
      ],

      '@angular-eslint/directive-class-suffix': [
        'error',
        {
          suffixes: ['Directive', 'Slot', 'Tree', 'Element', 'Tool'],
        },
      ],

      '@angular-eslint/no-output-on-prefix': ['warn'],
      '@angular-eslint/no-output-native': ['warn'],
      '@angular-eslint/no-output-rename': ['warn'],
      '@angular-eslint/no-input-rename': ['warn'],

      semi: [
        'error',
        'always',
        {
          omitLastInOneLineBlock: true,
        },
      ],

      'no-extra-semi': ['error'],
      'arrow-body-style': ['error', 'as-needed'],
      quotes: ['error', 'single'],
      'no-console': 'error',

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],
    },
  },
  ...compat.extends().map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
];
