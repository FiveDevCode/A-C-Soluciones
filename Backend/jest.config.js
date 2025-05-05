export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/services/**/*.js',
    'src/repository/**/*.js',
    'src/routers/**/*.js',
    'src/middlewares/**/*.js',
    'src/models/**/*.js'  
  ],
  transformIgnorePatterns: [
    "/node_modules/(?!<your-module-to-transform>)/"
  ],
};
