import { Loop } from '../../loop';
import { Mat } from '../../mat';
/**
 * Find the MAT from the given Shape.
 * @param loops An array of (possibly intersecting) Loops representing one or
 * more closed curves (i.e. shapes)
 * @param additionalPointCount Additional points per bezier where a MAT circle
 * will be added. Defaults to 3.
 */
declare function findMats(loops: Loop[], additionalPointCount?: number): Mat[];
export { findMats };
