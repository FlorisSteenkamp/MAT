
import { PointOnShape } from '../../point-on-shape';


/** @hidden */
function getSharpCorners(possPerLoop: PointOnShape[][]) {
    let sharpCornersPerLoop = [];
    
    for (let poss of possPerLoop) {
        let sharpCorners = [];
        
        for (let pos of poss) {
            if (PointOnShape.isQuiteSharpCorner(pos)) {
                sharpCorners.push(pos);
            }
        }
        
        sharpCornersPerLoop.push(sharpCorners);
    }

    return sharpCornersPerLoop;
}


export { getSharpCorners }
