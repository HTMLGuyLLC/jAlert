export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./tests/setup.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.min.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
        '<rootDir>/tests/**/*.test.js'
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(jquery|puppeteer)/)'
    ],
    // Puppeteer configuration for e2e tests
    globalSetup: undefined,
    globalTeardown: undefined,
    testEnvironmentOptions: {
        url: 'http://localhost'
    },
    globals: {
        'ts-jest': {
            useESM: true
        }
    }
}; 