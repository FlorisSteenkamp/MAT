
import { Loop         } from '../../../loop';
import { Curve        } from '../../../curve';
import { PointOnShape } from '../../../point-on-shape';

import { isPathPositivelyOrientated } from '../../fs/is-path-positively-oriented';
import { getLoopBounds } from '../get-loop-bounds';

import { ILoopTree  } from "./i-loop-tree";
import { IXInfo } from './i-x-info';


/**
 * Get initial intersection which is really a dummy intersection.
 * @param loop 
 * @param parent 
 */
function getInitialX(
        intersections : Map<Curve, IXInfo[]>, 
        parent: ILoopTree, 
        loop: Loop) {

    let dummyLoop: ILoopTree = { 
        parent,
        children: new Set(),
        beziers: [], 
        loop: undefined,
        orientation: isPathPositivelyOrientated(loop) ? -1 : +1, 
        windingNum: parent.windingNum
    }

    let pos = getLoopBounds(loop).minX;
    let curve = intersections.get(pos.curve);
    if (!curve) {
        pos = new PointOnShape(pos.curve, 0);
    }

    let x: IXInfo = {
        loop,
        pos,
        opposite : undefined, // will be set just below
        loopTree: dummyLoop,
    };

    x.opposite = x;

    return x;
}


export { getInitialX }
