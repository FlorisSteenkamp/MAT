import { eAdd, growExpansion, eMultDouble2 } from "big-float-ts";


/**
 * Returns a deflated version of the given polynomial at the given `t` value.
 * 
 * * Deflates the polynomial exactly (if `t` value is correct root is exact)
 * 
 * @param p 
 * @param x 
 * @returns 
 */
function eDeflate(p: number[][], x: number): number[][] {
    // console.log('eDeflate')
	const d = p.length-1;
	const bs = [p[0]];
	for (let i=1; i<d; i++) {
		bs.push(
			// p[i] + x*bs[i-1]
			eAdd(p[i], eMultDouble2(x,bs[i-1]))
		);
	}

	return bs;
}


export { eDeflate }
