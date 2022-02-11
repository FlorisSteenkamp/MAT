import { ElemType_TwoProng } from '../../mat/elem-type-two-prong.js';
/** @hidden */
interface ITwoProngDebugFunctions {
    logδ: (n: number, type?: ElemType_TwoProng) => void;
    log: (n: number, type?: ElemType_TwoProng) => void;
    drawNormal: (g: SVGGElement, n: number, showDelay?: number) => void;
    logδBasic: (n: number) => void;
    logNearest: (g: SVGGElement, p: number[], showDelay?: number) => void;
    traceConvergence: (g: SVGGElement, n: number, finalOnly?: boolean, showDelay?: number, range?: number[], type?: ElemType_TwoProng) => void;
}
/** @hidden */
declare let twoProngDebugFunctions: ITwoProngDebugFunctions;
export { ITwoProngDebugFunctions, twoProngDebugFunctions };
