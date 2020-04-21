
import { CpNode       } from '../cp-node';
import { IPointOnShape } from '../point-on-shape';
import { Circle       } from '../circle';
import { BezierPiece  } from '../mat/bezier-piece';
import { Generated    } from './debug';


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


export { TwoProngForDebugging }
