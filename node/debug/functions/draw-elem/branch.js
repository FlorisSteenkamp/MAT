import { drawFs } from 'flo-draw';
import { getCurveToNext } from '../../../get-curve-to-next.js';
/** @hidden */
function drawBranch(g, branch, delay) {
    let classes = 'thin5 purple nofill';
    let $svgs = [];
    let i = 0;
    for (let cpNode of branch) {
        if (cpNode.isTerminating()) {
            continue;
        }
        //let bezier = cpNode.matCurveToNextVertex;
        let bezier = getCurveToNext(cpNode);
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