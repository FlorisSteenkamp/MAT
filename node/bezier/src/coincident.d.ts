/**
 * Check if the two given cubic beziers are nearly coincident everywhere along
 * a finite stretch and returns the coincident stretch (if any), otherwise
 * returns undefined.
 * @param P - A cubic bezier curve.
 * @param Q - Another cubic bezier curve.
 * @param δ - An indication of how closely the curves should stay to
 * each other before considered coincident.
 */
declare function coincident(P: number[][], Q: number[][], δ?: number): {
    p: number[];
    q: number[];
};
export { coincident };
