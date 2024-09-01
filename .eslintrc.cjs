/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
import stylisticJs from '@stylistic/eslint-plugin-js'
module.exports = {
  root: true,
  plugins: { '@stylistic/js': stylisticJs },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        bracketSpacing: true
      }
    ],
    '@stylistic/js/array-bracket-spacing': ['error', 'always', { singleValue: false }],
    '@stylistic/js/space-in-parens': ['error', 'always']
  }
}
