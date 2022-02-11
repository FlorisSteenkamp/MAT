import { drawFs } from 'flo-draw';
import { traverseEdges } from '../../../traverse-edges.js';
import { getCurveToNext } from '../../../get-curve-to-next.js';
/** @hidden */
function drawMat(type) {
    let classes = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';
    return (g, mat) => {
        let cpNode = mat.cpNode;
        if (!cpNode) {
            return undefined;
        }
        let $svgs = [];
        let i = 0;
        traverseEdges(cpNode, cpNode => {
            if (cpNode.isTerminating()) {
                return;
            }
            let bezier = getCurveToNext(cpNode);
            if (!bezier) {
                return;
            }
            i++;
            $svgs.push(...drawFs.bezier(g, bezier, classes /*, i*500*/));
        });
        return $svgs;
    };
}
export { drawMat };
//# sourceMappingURL=mat.js.map