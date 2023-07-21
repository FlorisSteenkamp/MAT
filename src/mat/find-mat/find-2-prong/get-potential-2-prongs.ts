import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { isPosQuiteSharpCorner } from '../../../point-on-shape/is-pos-quite-sharp-corner.js';


/** @internal */
function getPotential2Prongs(possPerLoop: PointOnShape[][]) {
    const for2ProngsArray = []; 
    
    for (const poss of possPerLoop) {
        const for2Prongs = [];
        
        for (const pos of poss) {
            if (!isPosQuiteSharpCorner(pos)) {
                for2Prongs.push(pos);
            } 
        }
        
        for2ProngsArray.push(for2Prongs);
    }

    return for2ProngsArray;
}


export { getPotential2Prongs }
