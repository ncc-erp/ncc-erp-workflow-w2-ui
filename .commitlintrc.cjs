/* Reference: https://commitlint.js.org/#/reference-rules */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'test', 'revert', 'BREAKING CHANGE', 'hotfix'],
    ],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'upper-case'],
    'scope-empty': [2, 'never'],
  },
};
