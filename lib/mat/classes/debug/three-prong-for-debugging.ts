
import PointOnShape from '../../../geometry/classes/point-on-shape';
import ListNode     from '../../../linked-list/list-node';
import ContactPoint from '../../classes/contact-point';


class ThreeProngForDebugging {

    threeProng: {}; 
    deltas: ListNode<ContactPoint>[][]; 
    bestIndx: number; 
    candidateThreeProngs: {};
    deltasSimple: string[][];

    constructor(
        threeProng: {}, 
        deltas: ListNode<ContactPoint>[][], 
        bestIndx: number, 
        candidateThreeProngs: {}) {

        this.threeProng = threeProng;
        this.deltas     = deltas; 
        this.bestIndx   = bestIndx;
        this.candidateThreeProngs = candidateThreeProngs;

        this.deltasSimple = deltas.map(function(delta) {
            return [
                PointOnShape.toHumanString( delta[0].item.pointOnShape ),
                PointOnShape.toHumanString( delta[1].item.pointOnShape )
            ]; 
        });
    }
}


export default ThreeProngForDebugging;
