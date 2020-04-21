
import { IPointOnShape, isPosQuiteSharpCorner } from '../../point-on-shape';


/** @hidden */
function getSharpCorners(possPerLoop: IPointOnShape[][]) {
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


export { getSharpCorners }
