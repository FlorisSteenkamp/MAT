import { CpNode } from '../../cp-node/cp-node.js';
import { posToHumanString } from '../../point-on-shape/pos-to-human-string.js';


/** @internal */
export interface IGeneralDebugFunctions {
	nameObj     : (obj: any, pre?: string) => void,
	δToString   : (cpNodes: CpNode[]) => string[],
	δsToString  : (cpNodes: CpNode[][]) => string[][],
	pointToStr  : (p: number[], decimalPlaces?: number) => string
	pointsToStr : (ps: number[][], decimalPlaces?: number) => string[],
}


/** @internal */
let i = 0;
/** 
 * @internal
 * Name the given object - for debugging purposes only 
 */
function nameObj(o: any, pre = '') {
	o.name = '' + pre + i++;
}


/**
 * @internal
 * Transforms a boundary piece (δ) into a human readable string.
 * @param cpNodes A boundary piece given by two CpNodes.
 */
function δToString(cpNodes: CpNode[]) {
	return cpNodes.map(
		cpNode => posToHumanString(cpNode.cp.pointOnShape)
	);
}


/**
 * @internal
 * Transforms an array of boundary pieces (δs) into a human readable string. 
 * @param cpNodes An array of boundary pieces.
 */ 
function δsToString(cpNodes: CpNode[][]) {
	return cpNodes.map(δToString);
}


/**
 * @internal
 * Convert the given points into a human readable string.
 * @param ps
 */
function pointsToStr(ps: number[][], decimalPlaces = 3) {
	return ps.map(p => pointToStr(p, decimalPlaces));
}


/**
 * @internal
 * Converts the given point into a human readable string.
 * @param p The point
 * @param decimalPlaces number of decimal places
 */
function pointToStr(p: number[], decimalPlaces = 3) {
	return p[0].toFixed(decimalPlaces) + ', ' + p[1].toFixed(decimalPlaces); 
}


/** @internal */
const generalDebugFunctions/*: IGeneralDebugFunctions*/ = {
	δToString,
	δsToString,
	pointToStr,
	pointsToStr,
	nameObj,
}	


export { generalDebugFunctions }
