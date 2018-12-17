module.exports = {
  env: {
    'cypress/globals': true,
  },
  //   browser: true,
  //   es6: true,
  //   'jest/globals': true,
  // },
  extends: [
    'react-app',
    //   'airbnb',
    // 'eslint:recommended',
    // 'plugin:react/recommended',
    // 'plugin:flowtype/recommended',
  ],
  plugins: ['cypress'],
  // plugins: ['react', 'flowtype', 'jest'],
  // settings: {
  //   react: {
  //     version: '16.6',
  //   },
  // },
};
