import { CpNode } from '../cp-node';
import { PointOnShape } from '../point-on-shape';
import { Circle } from '../circle';
import { BezierPiece } from '../mat/bezier-piece';
import { Generated } from './debug';
/** @hidden */
declare class TwoProngForDebugging {
    generated: Generated;
    bezierPieces: BezierPiece[];
    pos: PointOnShape;
    δ: CpNode[];
    z: number[];
    circle: Circle;
    xs: {
        x: number[];
        y: PointOnShape;
        z: PointOnShape;
        t: number;
    }[];
    failed: boolean;
    holeClosing: boolean;
    notAdded: boolean;
    deleted: boolean;
    cpNode: CpNode;
    constructor(generated: Generated, bezierPieces: BezierPiece[], pos: PointOnShape, δ: CpNode[], z: number[], circle: Circle, xs: {
        x: number[];
        y: PointOnShape;
        z: PointOnShape;
        t: number;
    }[], failed: boolean, holeClosing: boolean, notAdded: boolean, deleted: boolean, cpNode?: CpNode);
}
export { TwoProngForDebugging };
