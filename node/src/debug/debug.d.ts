import * as Bezier3 from 'flo-bezier3';
import { CpNode } from '../cp-node';
import { PointOnShape } from '../point-on-shape';
import { Loop } from '../loop';
import { IGeneralDebugFunctions } from './functions/general';
import { ITwoProngDebugFunctions } from './functions/two-prong';
import { IThreeProngDebugFunctions } from './functions/three-prong';
import { IDrawElemFunctions } from './functions/draw-elem/draw-elem';
import { TwoProngForDebugging } from './two-prong-for-debugging';
import { ThreeProngForDebugging } from './three-prong-for-debugging';
import { DebugElemType } from './debug-elem-types';
import { CpNodeForDebugging } from './cp-node-for-debugging';
export declare type GeneratedElemTypes = {
    [T in DebugElemType]: any;
};
export interface GeneratedElems extends GeneratedElemTypes {
    twoProng_regular: TwoProngForDebugging[];
    twoProng_failed: TwoProngForDebugging[];
    twoProng_notAdded: TwoProngForDebugging[];
    twoProng_deleted: TwoProngForDebugging[];
    twoProng_holeClosing: TwoProngForDebugging[];
    looseBoundingBox: number[][][];
    tightBoundingBox: number[][][];
    oneProng: PointOnShape[];
    oneProngAtDullCorner: PointOnShape[];
    threeProng: ThreeProngForDebugging[];
    sharpCorner: PointOnShape[];
    dullCorner: PointOnShape[];
    minY: PointOnShape[];
    boundingHull: number[][][];
    mat: CpNode[];
    sat: CpNode[];
    cpNode: CpNodeForDebugging[];
    loop: Loop[];
    loops: Loop[][];
}
export interface ITiming {
    simplify: number[];
    holeClosers: number[];
    oneAnd2Prongs: number[];
    threeProngs: number[];
    mats: number[];
    sats: number[];
}
export interface IGenerated {
    elems: GeneratedElems;
    timing: ITiming;
}
export declare class Generated implements IGenerated {
    path: SVGPathElement;
    g: SVGGElement;
    elems: GeneratedElems;
    timing: ITiming;
    constructor(path: SVGPathElement, g: SVGGElement);
}
export interface IDebugFunctions extends IGeneralDebugFunctions {
    draw: Bezier3.IDrawFunctions;
    twoProng: ITwoProngDebugFunctions;
    threeProng: IThreeProngDebugFunctions;
    drawElem: IDrawElemFunctions;
}
export interface IDirectives {
    stopAfterHoleClosers: boolean;
    stopAfterHoleClosersNum: number;
    stopAfterTwoProngs: boolean;
    stopAfterTwoProngsNum: number;
    stopAfterThreeProngs: boolean;
}
declare class MatDebug {
    generated: Generated;
    generatedAll: Map<Loop[], Generated>;
    fs: IDebugFunctions;
    directives: IDirectives;
    /**
     * @param fs - some useful functions.
     */
    constructor(draw: Bezier3.IDrawFunctions);
    createNewGenerated(loops: Loop[], path: SVGPathElement, g: SVGGElement): void;
}
export { MatDebug };
