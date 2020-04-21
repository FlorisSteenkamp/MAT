
import { IPointOnShape, isPosQuiteSharpCorner } from '../../point-on-shape';


/** @hidden */
function getPotential2Prongs(possPerLoop: IPointOnShape[][]) {
    let for2ProngsArray = []; 
    
    for (let poss of possPerLoop) {
        let for2Prongs = [];
        
        for (let pos of poss) {
            if (!isPosQuiteSharpCorner(pos)) {
                for2Prongs.push(pos);
            } 
        }
        
        for2ProngsArray.push(for2Prongs);
    }

    return for2ProngsArray;
}


export { getPotential2Prongs }
