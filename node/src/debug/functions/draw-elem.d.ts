import { PointOnShape } from '../../mat/classes/point-on-shape';
import { Node } from '../../linked-list/node';
import { Vertex } from '../../mat/classes/vertex';
import { TwoProngForDebugging } from '../classes/two-prong-for-debugging';
import { ThreeProngForDebugging } from '../classes/three-prong-for-debugging';
export interface IDrawElemFunctions {
    draw1Prong: (pos: PointOnShape, visible?: boolean) => any;
    draw1ProngAtDullCorner: (pos: PointOnShape, visible?: boolean) => any;
    draw2Prong: (twoProng: TwoProngForDebugging, visible?: boolean) => any;
    draw3Prong: (threeProng: ThreeProngForDebugging, visible?: boolean) => any;
    drawExtreme: (extreme: {
        p: number[];
        bezierNode: Node<number[][]>;
        t: number;
    }, visible?: boolean) => any;
    drawLooseBoundingBox: (box: number[][], visible?: boolean) => any;
    drawTightBoundingBox: (box: number[][], visible?: boolean) => any;
    drawBoundingHull: (hull: number[][], visible?: boolean, style?: string) => any;
    drawSharpCorner: (pos: PointOnShape, visible?: boolean) => any;
    drawDullCorner: (pos: PointOnShape, visible?: boolean) => any;
    drawVertex: (node: Vertex, visible: boolean, displayDelay: number) => any;
}
declare let drawElemFunctions: {
    draw1Prong: (pos: PointOnShape, visible?: boolean) => {
        $center: any;
        $circle: any;
        $pos: any;
    };
    draw1ProngAtDullCorner: (pos: PointOnShape, visible?: boolean) => {
        $center: any;
        $circle: any;
        $pos: any;
    };
    draw2Prong: (twoProng: TwoProngForDebugging, visible?: boolean) => any;
    draw3Prong: (threeProng: ThreeProngForDebugging, visible?: boolean) => {
        $center: any;
        $cp1: any;
        $cp2: any;
        $cp3: any;
        $circle: any;
    };
    drawExtreme: (extreme: {
        p: number[];
        bezierNode: Node<number[][]>;
        t: number;
    }, visible?: boolean) => {
        $circle: any;
        $l1: any;
        $l2: any;
    };
    drawBoundingHull: (hull: number[][], visible?: boolean, style?: string) => {
        $polygon: any;
    };
    drawLooseBoundingBox: (box: number[][], visible?: boolean) => {
        $box: any;
    };
    drawTightBoundingBox: (box: number[][], visible?: boolean) => {
        $box: any;
    };
    drawSharpCorner: (pos: PointOnShape, visible?: boolean) => {
        $pos: any;
    };
    drawDullCorner: (pos: PointOnShape, visible?: boolean) => {
        $pos: any;
    };
    drawVertex: (vertex: Vertex, visible?: boolean, displayDelay?: number) => any;
};
export { drawElemFunctions };
