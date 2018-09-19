
import { Loop       } from '../../loop';

import { Circle       } from '../../circle';
import { CpNode       } from '../../cp-node';
import { PointOnShape } from '../../point-on-shape';
import { ContactPoint } from '../../contact-point';
import LlRbTree from 'flo-ll-rb-tree';


/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
function createInitialCpGraph(
        loops: Loop[], 
        cpTrees: Map<Loop, LlRbTree<CpNode>>,
        sharpCornerss: PointOnShape[][]) {

    let cpNode;

    for (let k=0; k<sharpCornerss.length; k++) {
        let sharpCorners = sharpCornerss[k];

        let cpTree = new LlRbTree(CpNode.comparator, [], true);
        
        let cp1_ = undefined;
        let cp2_ = undefined;
        for (let pos of sharpCorners) {
            let circle = new Circle(pos.p, 0);

            let cp1 = new ContactPoint(pos, circle, -1, 0);
            let cp2 = new ContactPoint(pos, circle, +1, 0);

            cp1_ = CpNode.insert(false, cpTree, cp1, cp2_);
            cp2_ = CpNode.insert(false, cpTree, cp2, cp1_);
            
            cp1_.prevOnCircle = cp2_; 
            cp2_.prevOnCircle = cp1_; 

            cp1_.nextOnCircle = cp2_; 
            cp2_.nextOnCircle = cp1_; 
        }

        if (!cpNode) { cpNode = cp1_; }

        let loop = loops[k];
        cpTrees.set(loop, cpTree);
    }

    return cpNode;
}


export { createInitialCpGraph }
