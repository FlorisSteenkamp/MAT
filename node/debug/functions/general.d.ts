import { CpNode } from '../../cp-node.js';
/** @hidden */
export interface IGeneralDebugFunctions {
    nameObj: (obj: any, pre?: string) => void;
    δToString: (cpNodes: CpNode[]) => string[];
    δsToString: (cpNodes: CpNode[][]) => string[][];
    pointToStr: (p: number[], decimalPlaces?: number) => string;
    pointsToStr: (ps: number[][], decimalPlaces?: number) => string[];
}
/**
 * @hidden
 * Name the given object - for debugging purposes only
 */
declare function nameObj(o: any, pre?: string): void;
/**
 * @hidden
 * Transforms a boundary piece (δ) into a human readable string.
 * @param cpNodes A boundary piece given by two CpNodes.
 */
declare function δToString(cpNodes: CpNode[]): string[];
/**
 * @hidden
 * Transforms an array of boundary pieces (δs) into a human readable string.
 * @param cpNodes An array of boundary pieces.
 */
declare function δsToString(cpNodes: CpNode[][]): string[][];
/**
 * @hidden
 * Convert the given points into a human readable string.
 * @param ps
 */
declare function pointsToStr(ps: number[][], decimalPlaces?: number): string[];
/**
 * @hidden
 * Converts the given point into a human readable string.
 * @param p The point
 * @param decimalPlaces number of decimal places
 */
declare function pointToStr(p: number[], decimalPlaces?: number): string;
/** @hidden */
declare const generalDebugFunctions: {
    δToString: typeof δToString;
    δsToString: typeof δsToString;
    pointToStr: typeof pointToStr;
    pointsToStr: typeof pointsToStr;
    nameObj: typeof nameObj;
};
export { generalDebugFunctions };
