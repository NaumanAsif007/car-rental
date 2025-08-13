module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  roots: ['<rootDir>/app/actions/rentals/__tests__'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
