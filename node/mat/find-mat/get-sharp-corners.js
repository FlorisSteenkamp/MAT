import { isPosQuiteSharpCorner } from '../../point-on-shape.js';
/** @hidden */
function getSharpCorners(possPerLoop) {
    let sharpCornersPerLoop = [];
    for (let poss of possPerLoop) {
        let sharpCorners = [];
        for (let pos of poss) {
            //if (PointOnShape.isQuiteSharpCorner(pos)) {
            if (isPosQuiteSharpCorner(pos)) {
                sharpCorners.push(pos);
            }
        }
        sharpCornersPerLoop.push(sharpCorners);
    }
    return sharpCornersPerLoop;
}
export { getSharpCorners };
//# sourceMappingURL=get-sharp-corners.js.map