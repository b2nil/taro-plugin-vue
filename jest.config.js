module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'esnext',
        noUnusedLocals: false
      }
    }
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/__tests__/**/*spec.ts'],
  roots: ['<rootDir>/src/']
}