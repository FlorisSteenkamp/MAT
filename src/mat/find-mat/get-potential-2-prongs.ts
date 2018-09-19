
import { PointOnShape } from '../../point-on-shape';


function getPotential2Prongs(possPerLoop: PointOnShape[][]) {
    let for2ProngsArray = []; 
    
    for (let poss of possPerLoop) {
        let for2Prongs = [];
        
        for (let pos of poss) {
            if (!PointOnShape.isQuiteSharpCorner(pos)) {
                for2Prongs.push(pos);
            } 
        }
        
        for2ProngsArray.push(for2Prongs);
    }

    return for2ProngsArray;
}


export { getPotential2Prongs }
