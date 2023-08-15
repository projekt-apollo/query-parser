/* eslint-env node */

module.exports = {
  root: true,
  extends: ['kentcdodds', 'kentcdodds/jest', 'prettier'],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'new-cap': ['error', {capIsNew: false}],
      },
    },
  ],
}
