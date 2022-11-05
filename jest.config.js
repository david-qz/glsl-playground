/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  preset: 'ts-jest',
  setupFiles: ['dotenv/config', './setup-tests.js'],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './setup-tests-after.ts',
  ],
  "moduleFileExtensions": [
    "js",
    "jsx",
    "tsx",
    "ts"
  ],
  maxWorkers: 1,
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    // See https://github.com/kulshekhar/ts-jest/issues/2010 for why the fix is
    // needed in ts-jest and
    // https://github.com/microsoft/TypeScript/issues/49083 for why TypeScript
    // makes us jump through these hoops in the first place.
    // Also the official docs talk about this too, but GoogleFu does not present
    // one with this information up-front:
    // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/', // The default, but keep it here since we're overriding.
    '/dist', // Do not test files we've transpiled.
    '/public', // Do not test files we've transpiled.
  ],
  transform: {
    '^.+\\.tsx?': [ 'ts-jest', { useESM: true } ],
    '^.+\\.jsx?': 'babel-jest',
  },
}
