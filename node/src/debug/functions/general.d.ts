import { CpNode } from '../../../cp-node';
/** @hidden */
export interface IGeneralDebugFunctions {
    nameObj: (obj: any, pre?: string) => void;
    δToString: (cpNodes: CpNode[]) => string[];
    δsToString: (cpNodes: CpNode[][]) => string[][];
    pointToStr: (p: number[], decimalPlaces?: number) => string;
    pointsToStr: (ps: number[][], decimalPlaces?: number) => string[];
}
/** @hidden */
declare let generalDebugFunctions: IGeneralDebugFunctions;
export { generalDebugFunctions };
