
const esModules = [
    'flo-bezier3',
    'flo-graham-scan',
    'flo-poly',
    'flo-gauss-quadrature',
    'flo-vector2d',
    'big-float-ts',
    'double-double',
    'flo-boolean',
    'flo-draw',
    'flo-memoize',
    'flo-ll-rb-tree',
    'flo-lines-intersections',
    'squares-rng'
].join('|');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: 'node',
    resolver: "jest-ts-webcompat-resolver",
    setupFilesAfterEnv: ['<rootDir>/__tests__/helpers/jest.setup.ts'],
    testMatch: [ "**/__tests__/**/*.spec.ts"],
    collectCoverage: false,  // Make true again!
    coverageProvider: 'v8',
    testTimeout: 15000,
    passWithNoTests: true,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest"
    },
    transformIgnorePatterns: [
        `/node_modules/(?!${esModules})`
    ]
};