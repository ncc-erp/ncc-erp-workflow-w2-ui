export default {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    DEV: true,
                    MODE: 'development',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTest.ts'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [
    'tsx',
    'ts',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|webp|svg)$':
      '<rootDir>/__mocks__/fileMockImage.js',
    '\\.(css|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^common(.*)$': '<rootDir>/src/common$1',
    '^api(.*)$': '<rootDir>/src/api$1',
    '^services(.*)$': '<rootDir>/src/services$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^hooks(.*)$': '<rootDir>/src/hooks$1',
    '^models(.*)$': '<rootDir>/src/models$1',
    '^themes(.*)$': '<rootDir>/src/themes$1',
    '^stores(.*)$': '<rootDir>/src/stores$1',
    '^features(.*)$': '<rootDir>/src/features$1',
  },
  coverageReporters: ['html', ['text', { file: 'coverage.txt' }]],
  coverageDirectory: '<rootDir>/src/tests/coverage',
  coveragePathIgnorePatterns: ['src/features/report/'],
  modulePathIgnorePatterns: ['<rootDir>/src/features/report/'],
};
