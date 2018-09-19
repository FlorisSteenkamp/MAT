import { Circle } from '../../mat/classes/circle';
import { Shape } from '../../mat/classes/shape';
import { BezierPiece } from '../../mat/classes/bezier-piece';
export interface IDrawFunctions {
    circle: (circle: Circle, classes?: string, delay?: number) => any;
    crossHair: (p: number[], classes?: string, r?: number, delay?: number) => any;
    crossHairs: (ps: number[][], classes?: string, r?: number, delay?: number) => any;
    dot: (p: number[], r?: number, color?: string, delay?: number) => any;
    line: (l: number[][], classes?: string, delay?: number) => any;
    looseBoundingBox: (box: number[][], class_?: string, delay?: number) => any;
    looseBoundingBoxes: (shape: Shape, class_?: string, delay?: number) => any;
    tightBoundingBox: (box: number[][], class_?: string, delay?: number) => any;
    tightBoundingBoxes: (shape: Shape, class_?: string, delay?: number) => any;
    beziers: (beziers: number[][][], delay?: number) => any;
    bezier: (bezier: number[][], class_?: string, delay?: number) => any;
    bezierPiece: (bezierPiece: BezierPiece, class_?: string, delay?: number) => any;
    bezierPieces: (bezierPieces: BezierPiece[], class_: string, delay?: number) => any;
    quadBezier: (ps: number[][], class_?: string, delay?: number) => any;
    polygon: (ls: number[][], class_?: string, delay?: number) => any;
}
