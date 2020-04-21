
/** @hidden */
declare var _debug_: Debug; 

import { Debug } from '../../../debug/debug';
import { IPointOnShape } from "../../../point-on-shape";
import { Circle } from "../../../circle";
import { CpNode } from "../../../cp-node";
import { BezierPiece } from '../../bezier-piece';
import { TwoProngForDebugging } from "../../../debug/two-prong-for-debugging";
import { getTwoProngType } from "../../get-two-prong-type";
import { ElemType_TwoProng } from "../../elem-type-two-prong";
import { TXForDebugging } from './x-for-debugging';


/** @hidden */
function addDebugInfo(
        bezierPieces: BezierPiece[],
        failed: boolean, 
        pos: IPointOnShape,
        circle: Circle, 
        z: IPointOnShape,
        δ: CpNode[], 
        xs: TXForDebugging[], 
        holeClosing: boolean) {

    let twoProng: TwoProngForDebugging = {
            generated: _debug_.generated,
            bezierPieces,
            pos,
            δ,
            z: z ? z.p : undefined,
            circle,
            xs,
            failed,
            holeClosing,
            notAdded: false,
            deleted: false,
            cpNode: undefined
    };

    let twoProngType = getTwoProngType(twoProng) as ElemType_TwoProng;
    _debug_.generated.elems[twoProngType].push(twoProng);
}


export { addDebugInfo }
