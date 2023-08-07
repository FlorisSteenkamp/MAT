import { TwoProngForDebugging } from '../two-prong-for-debugging.js';
import { ElemType_TwoProng } from '../../mat/elem-type-two-prong.js';
/** @internal */
interface ITwoProngDebugFunctions {
    logδ: (n: number, type?: ElemType_TwoProng) => void;
    log: (n: number, type?: ElemType_TwoProng) => void;
    drawNormal: typeof drawNormal;
    logδBasic: (n: number) => void;
    logNearest: (showSpokes?: boolean, showTrace?: boolean, showBoundaries?: boolean) => (g: SVGGElement, p: number[], showDelay?: number, scale?: number) => void;
    traceConvergence: typeof traceConvergence;
}
/**
 * @internal
 */
declare function drawNormal(g: SVGGElement, twoProng: TwoProngForDebugging, showDelay?: number): void;
/**
 * @internal
 * @param n - The 2-prong's zero-based index.
 * @param range
 */
declare function traceConvergence(g: SVGGElement, twoProng: TwoProngForDebugging, showDelay?: number, scale?: number): void;
/** @internal */
declare const twoProngDebugFunctions: ITwoProngDebugFunctions;
export { ITwoProngDebugFunctions, twoProngDebugFunctions };
