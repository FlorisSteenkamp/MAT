import * as Bezier3 from 'flo-bezier3';
import { IGeneralDebugFunctions } from './functions/general';
import { ITwoProngDebugFunctions } from './functions/two-prong';
import { IThreeProngDebugFunctions } from './functions/three-prong';
import { TDrawElemFunctions } from './functions/draw-elem/draw-elem';
import { IDebugElems } from './debug-elem-types';
declare type GeneratedElems = {
    [T in keyof IDebugElems]: IDebugElems[T][];
};
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
    drawElem: TDrawElemFunctions;
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
    generatedAll: Map<number[][][][], Generated>;
    fs: IDebugFunctions;
    directives: IDirectives;
    /**
     * @param fs - some useful functions.
     */
    constructor();
    createNewGenerated(bezierLoops: number[][][][], path: SVGPathElement, g: SVGGElement): void;
}
export { MatDebug, GeneratedElems };
