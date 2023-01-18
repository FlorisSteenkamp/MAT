import { IPointOnShape, isPosQuiteSharpCorner } from '../../point-on-shape.js';


/** @hidden */
function getSharpCorners(possPerLoop: IPointOnShape[][]) {
    const sharpCornersPerLoop = [];
    
    for (const poss of possPerLoop) {
        const sharpCorners = [];
        
        for (const pos of poss) {
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
