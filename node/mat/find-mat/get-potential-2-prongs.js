import { isPosQuiteSharpCorner } from '../../point-on-shape.js';
/** @hidden */
function getPotential2Prongs(possPerLoop) {
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
export { getPotential2Prongs };
//# sourceMappingURL=get-potential-2-prongs.js.map