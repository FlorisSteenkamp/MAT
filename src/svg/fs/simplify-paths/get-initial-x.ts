
import { Loop         } from '../../../loop/loop';
import { Curve        } from '../../../curve';
import { PointOnShape } from '../../../point-on-shape';

import { isPathPositivelyOrientated } from '../../fs/is-path-positively-oriented';
import { getLoopBounds } from '../get-loop-bounds';

import { ILoopTree  } from "./i-loop-tree";
import { X } from '../../../x/x';


/**
 * @hidden
 * Get initial intersection which is really a dummy intersection.
 * @param loop 
 * @param parent 
 */
function getInitialX(
        intersections : Map<Curve, X[]>, 
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

    let pos = getLoopBounds(loop).minY;

    let xs = intersections.get(pos.curve);
    
    // If no intersections on this curve, just start at 0
    if (!xs) { pos = new PointOnShape(pos.curve, 0); } 

    let x = new X(
        pos,
        true,
        undefined, // will be set just below
        dummyLoop,
    );
    x.opposite = x;

    return x;
}


export { getInitialX }
