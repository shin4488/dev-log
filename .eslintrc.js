module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  // add your custom rules here
  rules: {
    'no-console': 'warn',
    'no-extra-semi': 'warn',
    'dot-notation': 'warn',
    'prefer-const': 'error',
    'no-unreachable-loop': 'error',
    'no-var': 'error',
    // 「if () return;」のような記述は「{}」つきの記述とする
    curly: 'error',
    // 「(obj?.foo)();」->「(obj?.foo)?.();」
    'no-unsafe-optional-chaining': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
