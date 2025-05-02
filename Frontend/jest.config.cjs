module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js'],
    setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js']

}