import { drawFs } from "flo-draw";
import { closestPointOnBezier } from "flo-bezier3";
import { CpNode } from "../cp-node/cp-node.js";
import { findAndAdd2Prong } from "../find-2-prong/find-and-add-2-prong.js";
import { MatMeta } from "../mat/mat-meta.js";
import { getHalfAngle } from "./get-half-angles.js";
import { getMatCurveToNext } from "../cp-node/fs/get-mat-curve-to-next.js";
import { getAllOnCircle } from "../cp-node/fs/get-all-on-circle.js";
import { isTerminating } from "../cp-node/fs/is-terminating.js";
import { findAndAdd3Prongs } from "../find-3-prong.ts/find-and-add-3-prongs.js";
import { getBoundaryBezierPartsToNext } from "../cp-node/fs/get-boundary-bezier-parts-to-next.js";
import { drawBezierPieces } from "../debug/functions/draw/draw-bezier-pieces.js";
import { getAllOnLoop } from "../cp-node/fs/get-all-on-loop.js";
import { PointOnShape } from "../point-on-shape/point-on-shape.js";
import { getBoundaryBeziersToNext } from "../cp-node/fs/get-boundary-beziers-to-next.js";
import { isPosQuiteDullCorner } from "../point-on-shape/is-pos-quite-dull-corner.js";
import { MatOptions } from "./mat-options.js";


const draw = false;
const scale = 2/50;
const classes = [
    'red thin10 nofill',
    'green thin10 nofill',
    'deeppink thin10 nofill'
];

function add2rongsByError(
        options: Required<MatOptions>,
        tolerance: number,
        meta: MatMeta,
        cpStart: CpNode): number {

    // const g = document.getElementsByTagName('g')[0];

    let maxError = Number.NEGATIVE_INFINITY;

    const cpNodes = getAllOnLoop(cpStart);
    for (const cpNode of cpNodes) {
        const { t: tS } = cpNode.cp.pointOnShape;
        const { t: tE } = cpNode.next.cp.pointOnShape;
        if (((tS === 0 || tS === 1 || tE === 0 || tE === 1) &&
             isPosQuiteDullCorner(cpNode.cp.pointOnShape)) ||
            cpNode.isHoleClosing) {

            continue;
        }

        // don't check dull corners or hole closers
        if (isTerminating(cpNode)) {
            continue;
        }

        // drawFs.dot(g, cpNode.cp.circle.center, scale*2, 'darkgreen', 0)

        // let threeProngAdded = false;
        // if (draw) { drawFs.dot(g, cpNode.cp.circle.center, scale*1, 'darkgreen', 0); }

        const q = getMatCurveToNext(cpNode);

        const d = checkAndMaybeAddAnother(q, meta, tolerance, cpNodes, cpNode);
        if (d > maxError) {
            maxError = d;
        }
	}

    if (maxError > 0) {
        // console.log(maxError);
    }
    return maxError;
}


function checkAndMaybeAddAnother(
        q: number[][],
        meta: MatMeta,
        tolerance: number,
        cpNodes: CpNode[],
        cpNode: CpNode): number {

    // const g = document.getElementsByTagName('g')[0];

    const pos = getHalfAngle(cpNode);
    if (pos === undefined) { return 0; }

    // if (draw) { drawFs.bezier(g, q, 'thin50 deeppink nofill', 0); }

    const _newCpNode = findAndAdd2Prong(meta, pos);
    if (_newCpNode === undefined) { return 0; }

    // ...since a 3-prong might be revealed
    // const { closeByss: closeBys, addedCpNodes: threeProngCpNodes } = 
    //     findAndAdd3Prongs(meta, _newCpNode);
    // if (threeProngCpNodes.length > 0) {
    //     threeProngAdded = true;
    //     console.log('threeProngAdded')
    //     continue;
    // }

    // if (draw) { drawFs.dot(g, _newCpNode.cp.circle.center!, scale*1, 'red', 0); }

    const p = _newCpNode.cp.circle.center;
    const { d, p: pq } = closestPointOnBezier(q, p);
    // if (draw) { drawFs.line(g, [p,pq], 'thin2 darkgreen nofill', 0); }

    if (d < tolerance) {
        return 0;
    }

    // console.log(d);
    cpNodes.push(_newCpNode, cpNode);

    // if (draw) { drawFs.line(g, [p,pq], 'thin5 darkgreen nofill', 0); }
    // if (draw) { drawFs.dot(g, _newCpNode.cp.circle.center!, scale*3, 'red', 0); }
    // drawFs.line(g, [p,pq], 'thin20 darkgreen nofill', 0);
    // drawFs.dot(g, _newCpNode.cp.circle.center!, scale*3, 'red', 0);

    return d;
}


export { add2rongsByError }
