
import { CpNode       } from '../cp-node/cp-node';
import { PointOnShape } from '../point-on-shape';
import { Circle       } from '../circle';
import { BezierPiece  } from '../bezier-piece';
import { Generated    } from './debug';


class TwoProngForDebugging {
    constructor(
            public generated: Generated,
            public bezierPieces: BezierPiece[],
            public pos: PointOnShape, 
            public δ: CpNode[], 
            public z: number[],
            public circle: Circle, 
            public xs: { 
                x: number[]; 
                y: PointOnShape; 
                z: PointOnShape; 
                t: number; 
            }[], 
            public failed: boolean, 
            public holeClosing: boolean,
            public notAdded: boolean,
            public deleted: boolean,
            public cpNode: CpNode = undefined) {
    }
}


export { TwoProngForDebugging };
