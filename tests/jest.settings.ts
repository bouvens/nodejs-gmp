import { defaults as tsjPreset } from 'ts-jest/presets';

module.exports = {
  transform: tsjPreset.transform,
  roots: ['<rootDir>/tests/', '<rootDir>/src/'],
  testTimeout: 30000,
  rootDir: '..',
  testRegex: '.spec.ts$',
  setupFiles: ['./tests/jest.settings.ts'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node',
};
