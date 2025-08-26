import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
import { CpNode } from '../cp-node/cp-node.js';
import { CurvePiece } from '../mat/bezier-piece.js';
import { TwoProngForDebugging } from '../debug/two-prong-for-debugging.js';
import { getTwoProngType } from '../mat/get-two-prong-type.js';
import { ElemType_TwoProng } from '../mat/elem-type-two-prong.js';
import { TXForDebugging } from './x-for-debugging.js';


/** @internal */
function addDebugInfo(
        bezierPieces: CurvePiece[],
        failed: boolean, 
        x: number[],
        y: PointOnShape,
        z: PointOnShape,
        circle: Circle,
        δ: CpNode[], 
        xs: TXForDebugging[], 
        holeClosing: boolean) {

//     xs.push({ x, y, z, t: y.t });

//     const twoProng: TwoProngForDebugging = {
//             generated: _debug_.generated,
//             bezierPieces,
//             pos: y,
//             δ,
//             z: z ? z.p : undefined!,
//             circle,
//             xs,
//             failed,
//             holeClosing,
//             notAdded: false,
//             deleted: false,
//             cpNode: undefined!
//     };

//     const twoProngType = getTwoProngType(twoProng) as ElemType_TwoProng;
//     _debug_.generated.elems[twoProngType].push(twoProng);
}


export { addDebugInfo }
