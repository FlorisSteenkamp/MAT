import { PointOnShape } from '../../point-on-shape/point-on-shape.js';
import { isPosQuiteSharpCorner } from '../../point-on-shape/is-pos-quite-sharp-corner.js';


/** @internal */
function getSharpCorners(possPerLoop: PointOnShape[][]) {
    const sharpCornersPerLoop = [];
    
    for (const poss of possPerLoop) {
        const sharpCorners = [];
        
        for (const pos of poss) {
            if (isPosQuiteSharpCorner(pos)) {
                sharpCorners.push(pos);
            }
        }
        
        sharpCornersPerLoop.push(sharpCorners);
    }

    return sharpCornersPerLoop;
}


export { getSharpCorners }
