import { PointOnShape } from '../../../point-on-shape';
import { CpNode } from '../../../cp-node';
import { Loop } from '../../../loop';
import { TwoProngForDebugging } from '../../two-prong-for-debugging';
import { ThreeProngForDebugging } from '../../three-prong-for-debugging';
import { DebugElemType } from '../../debug-elem-types';
export declare type TDrawElemFunctions = {
    [T in DebugElemType]: (g: SVGGElement, elem: any) => SVGElement[];
};
export interface IDrawElemFunctions extends TDrawElemFunctions {
    oneProng: (g: SVGGElement, pos: PointOnShape) => SVGElement[];
    oneProngAtDullCorner: (g: SVGGElement, pos: PointOnShape) => SVGElement[];
    twoProng_regular: (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[];
    twoProng_failed: (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[];
    twoProng_notAdded: (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[];
    twoProng_deleted: (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[];
    twoProng_holeClosing: (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[];
    threeProng: (g: SVGGElement, threeProng: ThreeProngForDebugging) => SVGElement[];
    minY: (g: SVGGElement, pos: PointOnShape) => SVGElement[];
    looseBoundingBox: (g: SVGGElement, box: number[][]) => SVGElement[];
    tightBoundingBox: (g: SVGGElement, box: number[][]) => SVGElement[];
    boundingHull: (g: SVGGElement, hull: number[][], style?: string) => SVGElement[];
    sharpCorner: (g: SVGGElement, pos: PointOnShape) => SVGElement[];
    dullCorner: (g: SVGGElement, pos: PointOnShape) => SVGElement[];
    vertex: (g: SVGGElement, node: CpNode, visible: boolean, displayDelay: number) => SVGElement[];
    loop: (g: SVGGElement, loop: Loop) => SVGElement[];
    loops: (g: SVGGElement, loops: Loop[]) => SVGElement[];
}
declare let drawElemFunctions: IDrawElemFunctions;
export { drawElemFunctions };
