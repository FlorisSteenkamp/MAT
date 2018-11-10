import allRoots from './src/all-roots-recursive';
import fromRoots from './src/from-roots';
/**
* Simple & fast practical library functions for functional univariate
* polynomials over the reals (actually ECMAScript numbers, i.e. double
* floats).
*
* All polinomials are represented as a simple array starting with the
* highest non-zero power, e.g.
*   3x^3 + 5x^2 + 7x + 2 -> [3,5,7,2]
*
* @ignore
*/
declare const FloPoly: {
    random: {
        flatRoots: (d: number, a?: number, b?: number, seed?: number, odds?: number) => {
            p: number[];
            seed: number;
        };
        flatRootsArr: (n: number, d: number, a: number, b: number, seed: number, odds: number) => number[][];
        flatCoefficients: (d: number, a?: number, b?: number, seed?: number) => {
            p: number[];
            seed: number;
        };
        flatCoefficientsArr: (n: number, d: number, a: number, b: number, seed: number, odds: number) => number[][];
    };
    fromRoots: typeof fromRoots;
    allRoots: typeof allRoots;
    hornerErrorBound: (p: number[], x: number) => number;
    rootMagnitudeUpperBound_fujiwara: (p: number[]) => number;
    positiveRootUpperBound_LMQ: (p: number[]) => number;
    positiveRootLowerBound_LMQ: (p: number[]) => number;
    negativeRootUpperBound_LMQ: (p: number[]) => number;
    negativeRootLowerBound_LMQ: (p: number[]) => number;
    rootMagnitudeUpperBound_rouche: (p: number[]) => number;
    quadraticRoots: (p: number[]) => number[];
    numRootsWithin: (p: number[], a: number, b: number) => number;
    brent: (f: (n: number) => number, a: number, b: number) => number;
    bisection: (f: (n: number) => number, a: number, b: number) => number;
    equal: (p1: number[], p2: number[]) => boolean;
    add: (p1: number[], p2: number[]) => number[];
    subtract: (p1: number[], p2: number[]) => number[];
    multiplyByConst: (c: number, p: number[]) => number[];
    negate: (p: number[]) => number[];
    differentiate: (p: number[]) => number[];
    multiply: (p1: number[], p2: number[]) => number[];
    degree: (p: number[]) => number;
    evaluate: {
        (p: number[], a: number): number;
        (p: number[]): (a: number) => number;
    };
    evaluateAt0: (p: number[]) => number;
    signChanges: (p: number[]) => number;
    invert: (p: number[]) => number[];
    changeVariables: (p: number[], a: number, b: number) => number[];
    reflectAboutYAxis: (p: number[]) => number[];
    sturmChain: (p: number[]) => number[][];
    clip: (p: number[], δ: number) => number[];
    clip0: (p: number[]) => number[];
    deflate: (p: number[], root: number) => number[];
    maxCoefficient: (p: number[]) => number;
    toCasStr: (p: number[]) => string;
};
export default FloPoly;
