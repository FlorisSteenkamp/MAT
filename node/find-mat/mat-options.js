const defaultMatOptions = {
    maxCurviness: 0.05,
    maxLength: 40,
    applySat: true,
    satScale: 2,
    simplify: true,
    simplifyTolerance: 2 ** -4,
    minBezLength: 2 ** -6,
    angleIncrement: 15
    // adaptiveTolerance: true,
};
const matOptionRanges = {
    maxCurviness: {
        range: [0.01, 3],
        scaleByMaxCoordinate: false
    },
    maxLength: {
        range: [1, 1024],
        scaleByMaxCoordinate: true
    },
    angleIncrement: {
        range: [0.1, 360],
        scaleByMaxCoordinate: false
    },
    satScale: {
        range: [1, Infinity],
        scaleByMaxCoordinate: false
    },
    simplifyTolerance: {
        range: [2 ** -20, 2 ** 20],
        scaleByMaxCoordinate: true
    },
    minBezLength: {
        range: [2 ** -20, 2],
        scaleByMaxCoordinate: true
    }
};
export { defaultMatOptions, matOptionRanges };
//# sourceMappingURL=mat-options.js.map