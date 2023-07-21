import { PointOnShape } from "./point-on-shape.js"


/**
 * Returns a human-readable string of the given [[PointOnShape]]. 
 * For debugging only.
 * @internal
 */
function posToHumanString(pos: PointOnShape) {
    return '' + pos.p[0] + ', ' + pos.p[1] + 
        ' | bz: '   + pos.curve.idx + 
        ' | t: '    + pos.t 
}


export { posToHumanString }
