export default {
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/tests/e2e/**/*.test.js',
        '<rootDir>/tests/visual/**/*.test.js'
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
    testTimeout: 30000,
    // ESM support
    globals: {
        'ts-jest': {
            useESM: true
        }
    }
}; 