import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    verbose: true,
    preset: 'ts-jest',
    watchman: false,
    globalSetup: '<rootDir>/test/setup.ts',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    testRegex: '.*/test/.*\\.spec\\.ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
