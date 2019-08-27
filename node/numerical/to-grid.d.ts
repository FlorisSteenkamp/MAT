/**
 * Sends a onto a fixed-spacing grid with 2**12 divisions.
 * @param a
 * @param expMax Max extent of grid in positive and negative directions - given
 * as 2^expMax
 */
declare function toGrid(a: number, expMax: number, significantFigures: number): number;
export { toGrid };
