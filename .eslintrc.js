module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
  ],
  plugins: ['react', 'flowtype', 'jest'],
  settings: {
    react: {
      version: '16.6',
    },
  },
};
