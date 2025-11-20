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
        range: [0.01, 3]
    },
    maxLength: {
        range: [1, 1024],
        scaleByMaxRadius: true
    },
    angleIncrement: {
        range: [0.1, 360]
    },
    satScale: {
        range: [1, Number.POSITIVE_INFINITY],
    },
    simplifyTolerance: {
        range: [2 ** -10, 1024],
        scaleByMaxCoordinate: true
    },
    minBezLength: {
        range: [2 ** -20, 2],
        scaleByMaxCoordinate: true
    }
};
export { defaultMatOptions, matOptionRanges };
//# sourceMappingURL=mat-options.js.map