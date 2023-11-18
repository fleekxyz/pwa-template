import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import ts from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import js from '@eslint/js'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        config: './tsconfig.json',
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      ts,
    },
  },
  stylistic.configs['recommended-flat'],
]
