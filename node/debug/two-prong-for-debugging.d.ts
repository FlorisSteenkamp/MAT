import { CpNode } from '../cp-node.js';
import { IPointOnShape } from '../point-on-shape.js';
import { Circle } from '../circle.js';
import { BezierPiece } from '../mat/bezier-piece.js';
import { Generated } from './debug.js';
/** @hidden */
interface TwoProngForDebugging {
    generated: Generated;
    bezierPieces: BezierPiece[];
    pos: IPointOnShape;
    δ: CpNode[];
    z: number[];
    circle: Circle;
    xs: {
        x: number[];
        y: IPointOnShape;
        z: IPointOnShape;
        t: number;
    }[];
    failed: boolean;
    holeClosing: boolean;
    notAdded: boolean;
    deleted: boolean;
    cpNode: CpNode;
}
export { TwoProngForDebugging };
