import { expect } from '@jest/globals';


/** Asserts two points (or any equal-length number arrays) are nearly equal. */
function expectPointClose(
        actual: number[],
        expected: number[],
        digits = 9): void {

    expect(actual.length).toBe(expected.length);
    for (let i=0; i<actual.length; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], digits);
    }
}


/** Asserts two bezier curves are nearly equal (same order and control points). */
function expectBezierClose(
        actual: number[][],
        expected: number[][],
        digits = 9): void {

    expect(actual.length).toBe(expected.length);
    for (let i=0; i<actual.length; i++) {
        expectPointClose(actual[i], expected[i], digits);
    }
}


/** Asserts consecutive beziers in the array join up end-to-start. */
function expectBeziersConnected(
        pss: number[][][],
        digits = 9): void {

    for (let i=1; i<pss.length; i++) {
        const prev = pss[i-1];
        expectPointClose(pss[i][0], prev[prev.length-1], digits);
    }
}


export { expectPointClose, expectBezierClose, expectBeziersConnected }
