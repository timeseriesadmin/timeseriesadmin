module.exports = {
  env: {
    'cypress/globals': true,
    browser: true,
    jasmine: true,
    jest: true,
  },
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['cypress', 'react', '@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
};
