import { drawFs } from 'flo-draw';
import { traverseEdges } from '../../../cp-node/traverse-edges.js';
import { getCurveToNext } from '../../../cp-node/get-curve-to-next.js';
import { isTerminating } from '../../../cp-node/cp-node.js';
/** @internal */
function drawMat(type) {
    const classes = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';
    return (g, mat, classes_, delay = 0, scaleFactor = 1) => {
        const cpNode = mat.cpNode;
        // if (!cpNode) { return undefined; }
        if (!cpNode) {
            return [];
        }
        const $svgs = [];
        let i = 0;
        traverseEdges(cpNode, cpNode => {
            if (isTerminating(cpNode)) {
                return;
            }
            const bezier = getCurveToNext(cpNode);
            if (!bezier) {
                return;
            }
            i++;
            $svgs.push(...drawFs.bezier(g, bezier, classes, delay));
        });
        return $svgs;
    };
}
export { drawMat };
//# sourceMappingURL=mat.js.map