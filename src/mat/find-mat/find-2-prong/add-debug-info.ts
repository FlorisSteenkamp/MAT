/** @internal */
declare const _debug_: Debug; 

import { Debug } from '../../../debug/debug.js';
import { IPointOnShape } from '../../../point-on-shape.js';
import { Circle } from '../../../circle.js';
import { CpNode } from '../../../cp-node.js';
import { BezierPiece } from '../../bezier-piece.js';
import { TwoProngForDebugging } from '../../../debug/two-prong-for-debugging.js';
import { getTwoProngType } from '../../get-two-prong-type.js';
import { ElemType_TwoProng } from '../../elem-type-two-prong.js';
import { TXForDebugging } from './x-for-debugging.js';


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

    const twoProng: TwoProngForDebugging = {
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

    const twoProngType = getTwoProngType(twoProng) as ElemType_TwoProng;
    _debug_.generated.elems[twoProngType].push(twoProng);
}


export { addDebugInfo }
