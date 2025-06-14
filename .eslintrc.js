module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
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
  overrides: [
    {
      files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
      env: {
        jest: true,
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  ],
};
