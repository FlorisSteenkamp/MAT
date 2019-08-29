import { IDrawFunctions } from 'flo-bezier3';
import { IGeneralDebugFunctions } from './functions/general';
import { ITwoProngDebugFunctions } from './functions/two-prong';
import { IThreeProngDebugFunctions } from './functions/three-prong';
import { TDrawElemFunctions } from './functions/draw-elem/draw-elem';
import { IDebugElems } from './debug-elem-types';
/** @hidden */
declare type GeneratedElems = {
    [T in keyof IDebugElems]: IDebugElems[T][];
};
/** @hidden */
export interface ITiming {
    simplify: number[];
    holeClosers: number[];
    oneAnd2Prongs: number[];
    threeProngs: number[];
    mats: number[];
    sats: number[];
}
/** @hidden */
export interface IGenerated {
    elems: GeneratedElems;
    timing: ITiming;
}
/** @hidden */
export declare class Generated implements IGenerated {
    path: SVGPathElement;
    g: SVGGElement;
    elems: GeneratedElems;
    timing: ITiming;
    constructor(path: SVGPathElement, g: SVGGElement);
}
/** @hidden */
export interface IDebugFunctions extends IGeneralDebugFunctions {
    draw: IDrawFunctions;
    twoProng: ITwoProngDebugFunctions;
    threeProng: IThreeProngDebugFunctions;
    drawElem: TDrawElemFunctions;
}
/** @hidden */
export interface IDirectives {
    stopAfterHoleClosers: boolean;
    stopAfterHoleClosersNum: number;
    stopAfterTwoProngs: boolean;
    stopAfterTwoProngsNum: number;
    stopAfterThreeProngs: boolean;
}
/** @hidden */
declare class MatDebug {
    generated: Generated;
    fs: IDebugFunctions;
    directives: IDirectives;
    /**
     * @param fs - some useful functions.
     */
    constructor();
    createNewGenerated(path: SVGPathElement, g: SVGGElement): void;
}
export { MatDebug, GeneratedElems };
