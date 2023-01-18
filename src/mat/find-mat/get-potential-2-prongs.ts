import { IPointOnShape, isPosQuiteSharpCorner } from '../../point-on-shape.js';


/** @hidden */
function getPotential2Prongs(possPerLoop: IPointOnShape[][]) {
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
