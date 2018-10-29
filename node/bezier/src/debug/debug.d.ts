import { IDrawFunctions } from './draw-functions';
import { IDrawElemFunctions } from './draw-elem/draw-elem';
import { FatLine } from './fat-line';
export declare type DebugElemType = 'beziers' | 'intersection' | 'looseBoundingBox' | 'tightBoundingBox' | 'extreme' | 'boundingHull' | 'fatLine';
export declare type GeneratedElemTypes = {
    [T in DebugElemType]: any;
};
export interface GeneratedElems extends GeneratedElemTypes {
    beziers: number[][][][];
    intersection: number[][];
    looseBoundingBox: number[][][];
    tightBoundingBox: number[][][];
    extreme: {
        p: number[];
        t: number;
    }[];
    boundingHull: number[][][];
    fatLine: FatLine[];
}
export interface IGenerated {
    elems: GeneratedElems;
}
export interface IDebugFunctions {
    draw: IDrawFunctions;
    drawElem: IDrawElemFunctions;
}
export declare class BezDebug implements BezDebug {
    draw: IDrawFunctions;
    g: SVGGElement;
    generated: IGenerated;
    fs: IDebugFunctions;
    /**
     * @param config - configuration settings.
     * @param fs - some useful functions.
     * @private
     */
    constructor(draw: IDrawFunctions, g: SVGGElement);
}
