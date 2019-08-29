
import { getLoopBounds } from "../../svg/fs/get-loop-bounds";
import { Loop } from "../../loop";


/**
 * @hidden
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
function getMaxCoordinate(loops: number[][][][]): number {
    let max = 0;

    for (let loop of loops) {
        for (let ps of loop) {
            for (let p of ps) {
                for (let c of p) {
                    let c_ = Math.abs(c);
                    if (c_ > max) { max = c_; }
                }
            }
        }
    }

    return max;
}


export { getMaxCoordinate }
