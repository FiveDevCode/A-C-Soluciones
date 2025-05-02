 export default  {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: ['test/**/*.js'],
  transformIgnorePatterns: [
    "/node_modules/(?!<your-module-to-transform>)/"
  ],
};
