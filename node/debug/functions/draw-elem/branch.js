import { drawFs } from 'flo-draw';
import { isTerminating } from '../../../cp-node/cp-node.js';
import { getCurveToNext } from '../../../cp-node/get-curve-to-next.js';
/** @internal */
function drawBranch(g, branch, delay) {
    const classes = 'thin5 purple nofill';
    const $svgs = [];
    let i = 0;
    for (const cpNode of branch) {
        if (isTerminating(cpNode)) {
            continue;
        }
        //let bezier = cpNode.matCurveToNextVertex;
        const bezier = getCurveToNext(cpNode);
        if (!bezier) {
            continue;
        }
        i++;
        $svgs.push(...drawFs.bezier(g, bezier, classes, delay));
    }
    return $svgs;
}
export { drawBranch };
//# sourceMappingURL=branch.js.map