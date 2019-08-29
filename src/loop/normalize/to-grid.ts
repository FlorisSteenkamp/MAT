
import { reduceSignificand } from "flo-numerical";


/**
 * @hidden
 * Sends a onto a fixed-spacing grid with 2**12 divisions.
 * @param a 
 * @param expMax Max extent of grid in positive and negative directions - given
 * as 2^expMax 
 */
function toGrid(
        a: number, 
        expMax: number,
        significantFigures: number): number {

    let expA = Math.floor(Math.log2(Math.abs(a)));
    let expDif = expMax - expA;
    let newSig = significantFigures - expDif + 1;
    
    if (newSig <= 0) { return 0; }

    let res = reduceSignificand(a, newSig);

    return res;
}


export { toGrid }
