import { CpNode } from '../../cp-node';
export interface IGeneralDebugFunctions {
    nameObj: (obj: any, pre?: string) => void;
    δToString: (cpNodes: CpNode[]) => string[];
    δsToString: (cpNodes: CpNode[][]) => string[][];
    pointToStr: (p: number[], decimalPlaces?: number) => string;
    pointsToStr: (ps: number[][], decimalPlaces?: number) => string[];
}
declare let generalDebugFunctions: IGeneralDebugFunctions;
export { generalDebugFunctions };
