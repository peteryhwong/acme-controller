import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
    verbose: true,
    preset: 'ts-jest',
    watchman: false,
    setupFiles: [
        './jest.setup.ts',
    ],
    setupFilesAfterEnv: [
        '<rootDir>/src/controller/__tests__/setupTests.ts',
    ],
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/componentTests/',
    ],
    testRegex: '.*/__tests__/.*\\.spec\\.ts$',
    moduleFileExtensions: [
        'ts',
        'js',
        'json',
    ],
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!src/**/*.d.ts",
        "!src/**/*.spec.ts",
        "!src/migration/*.{js,ts}",
        "!src/openapi/**/*.ts",
        '!src/openapi-generator.ts',
        '!src/controller/schema.ts',
    ],
    coverageThreshold: {
        global: {
            'statements': 30,
            'branches': 10,
            'functions': 8,
            'lines': 30,
        },
    },
};

export default config;
