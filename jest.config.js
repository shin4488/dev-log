module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/file-mock.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
