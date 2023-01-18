import { drawFs } from 'flo-draw';
import { traverseEdges } from '../../../traverse-edges.js';
import { getCurveToNext } from '../../../get-curve-to-next.js';
/** @hidden */
function drawMat(type) {
    const classes = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';
    return (g, mat) => {
        const cpNode = mat.cpNode;
        if (!cpNode) {
            return undefined;
        }
        const $svgs = [];
        let i = 0;
        traverseEdges(cpNode, cpNode => {
            if (cpNode.isTerminating()) {
                return;
            }
            const bezier = getCurveToNext(cpNode);
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