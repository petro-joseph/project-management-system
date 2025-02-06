import type { Config } from '@jest/types';
import { defaults as tsjPreset } from 'ts-jest/presets';

const config: Config.InitialOptions = {
  ...tsjPreset,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  
  // Global settings
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Coverage settings
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/test/**',
    '!src/migrations/**',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Projects configuration for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/test/unit/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/src/test/unit/setup.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/src/test/integration/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/src/test/integration/setup.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/src/test/e2e/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/src/test/e2e/setup.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
    },
  ],

  // Global setup/teardown
  globalSetup: '<rootDir>/src/test/global-setup.ts',
  globalTeardown: '<rootDir>/src/test/global-teardown.ts',

  // Module name mapper for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;