
import { CpNode       } from '../../cp-node/cp-node';
import { ContactPoint } from '../../contact-point';
import { PointOnShape } from '../../point-on-shape';


export interface IGeneralDebugFunctions {
	nameObj     : (obj: any, pre?: string) => void,
	δToString   : (cpNodes: CpNode[]) => string[],
	δsToString  : (cpNodes: CpNode[][]) => string[][],
	pointToStr  : (p: number[], decimalPlaces?: number) => string
	pointsToStr : (ps: number[][], decimalPlaces?: number) => string[],
}


let i = 0;
/** Name the given object - for debugging purposes only */
function nameObj(o: any, pre: string = '') {
	o.name = '' + pre + i++;
}

/**
 * Transforms a boundary piece (δ) into a human readable string.
 * @param cpNodes A boundary piece given by two CpNodes.
 */
function δToString(cpNodes: CpNode[]) {
	return cpNodes.map(
		cpNode => PointOnShape.toHumanString(cpNode.cp.pointOnShape)
	);
}


/**
 * Transforms an array of boundary pieces (δs) into a human readable string. 
 * @param cpNodes An array of boundary pieces.
 */ 
function δsToString(cpNodes: CpNode[][]) {
	return cpNodes.map(δToString);
}


/**
 * Convert the given points into a human readable string.
 * @param ps
 */
function pointsToStr(ps: number[][], decimalPlaces = 3) {
	return ps.map(p => pointToStr(p, decimalPlaces));
}


/**
 * Converts the given point into a human readable string.
 * @param p - The point
 * @param decimalPlaces - number of decimal places
 */
function pointToStr(p: number[], decimalPlaces: number = 3) {
	return p[0].toFixed(decimalPlaces) + ', ' + p[1].toFixed(decimalPlaces); 
}


let generalDebugFunctions: IGeneralDebugFunctions = {
	δToString,
	δsToString,
	pointToStr,
	pointsToStr,
	nameObj,
}	


export { generalDebugFunctions };
