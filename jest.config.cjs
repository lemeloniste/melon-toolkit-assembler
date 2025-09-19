// jest.config.cjs
const path = require('path');

module.exports = {
  // Use a mock environment for testing
  testEnvironment: 'jest-environment-jsdom',

  // Use a module mapper to explicitly point to the file
  moduleNameMapper: {
    '^@testing-library/jest-dom$': '<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js'
  },
  
  // This is the setup file that Jest will now find
  setupFilesAfterEnv: ['@testing-library/jest-dom'],

  // We explicitly tell Jest to transform ES Modules and our code with Babel.
  transform: {
    '^.+\\.(js|mjs|jsx)$': 'babel-jest',
  },

  // Specify where Jest should look for test files
  testMatch: [
    '**/tests/**/*.test.mjs'
  ],

  // Set up code coverage
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.{js,mjs,jsx}',
  ],
  
  // Ignore specific file patterns in the transform process
  transformIgnorePatterns: [
    'node_modules/(?!(n3)/)'
  ],
};
