module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir}/node_modules/',
    '!<rootDir}/dist/',
    '!<rootDir}/src/index.tsx',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  coverageReporters: [
    'text',
    'cobertura',
  ],
  testResultsProcessor: 'jest-junit',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  restoreMocks: true,
  // coverageThreshold: {
  //   global: {
  //     statements: 58,
  //     branches: 49,
  //     functions: 50,
  //     lines: 57,
  //   },
  // },
};
