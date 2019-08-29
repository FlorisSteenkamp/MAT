
/** @hidden */
declare var _debug_: MatDebug; 

import { MatDebug } from '../../../debug/debug';
import { PointOnShape } from "../../../point-on-shape";
import { Circle } from "../../../circle";
import { CpNode } from "../../../cp-node/cp-node";
import { BezierPiece } from '../../../bezier-piece';
import { TwoProngForDebugging } from "../../../debug/two-prong-for-debugging";
import { getTwoProngType } from "../../get-two-prong-type";
import { ElemType_TwoProng } from "../../elem-type-two-prong";
import { TXForDebugging } from './x-for-debugging';


/** @hidden */
function addDebugInfo(
        bezierPieces: BezierPiece[],
        failed: boolean, 
        pos: PointOnShape, 
        circle: Circle, 
        z: PointOnShape, 
        δ: CpNode[], 
        xs: TXForDebugging[], 
        holeClosing: boolean) {

    let twoProng = new TwoProngForDebugging(
            _debug_.generated,
            bezierPieces,
            pos,
            δ,
            z ? z.p : undefined,
            circle,
            xs,
            failed,
            holeClosing,
            false,
            false
    ); 

    let twoProngType = getTwoProngType(twoProng) as ElemType_TwoProng;
    _debug_.generated.elems[twoProngType].push(twoProng);
}


export { addDebugInfo }
