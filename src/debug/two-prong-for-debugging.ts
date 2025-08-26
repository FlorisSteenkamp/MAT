import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
import { CurvePiece } from '../mat/bezier-piece.js';
import { Generated } from './debug.js';


/** @internal */
interface TwoProngForDebugging {
    generated: Generated;
    bezierPieces: CurvePiece[];
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
}


export { TwoProngForDebugging }
