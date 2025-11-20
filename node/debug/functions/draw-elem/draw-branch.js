import { getMatCurveToNext } from '../../../cp-node/fs/get-mat-curve-to-next.js';
import { isTerminating } from '../../../cp-node/fs/is-terminating.js';
import { drawBeziersAsSinglePath } from '../draw/draw-beziers-as-single-path.js';
/** @internal */
function drawBranch(g, branch, classes = 'thin5 purple nofill', delay = 0, scaleFactor = 1) {
    const $svgs = [];
    let i = 0;
    const pss = [];
    for (const cpNode of branch) {
        if (isTerminating(cpNode)) {
            continue;
        }
        const bezier = getMatCurveToNext(cpNode);
        if (!bezier) {
            continue;
        }
        i++;
        // $svgs.push( ...drawFs.bezier(g, bezier, classes, delay));
        pss.push(bezier);
    }
    // return $svgs;
    $svgs.push(...drawBeziersAsSinglePath(g, pss, classes, delay));
    return $svgs;
}
export { drawBranch };
//# sourceMappingURL=draw-branch.js.map