import { drawOneProng } from './draw-one-prong.js';
import { drawTwoProng } from './draw-two-prong.js';
import { drawThreeProng } from './draw-three-prong.js';
import { vertex } from './draw-vertex.js';
import { boundingHull } from './bounding-hull.js';
import { looseBoundingBox } from './draw-loose-bounding-box.js';
import { tightBoundingBox } from './draw-tight-bounding-box.js';
import { drawMat } from './draw-mat.js';
import { maxVertex } from './draw-max-vertex.js';
import { drawLeaves } from './draw-leaves.js';
import { drawCull } from './draw-cull.js';
import { drawBranch } from './draw-branch.js';
import { drawCpNode } from './draw-cp-node.js';
import { drawSpeed } from './draw-speed.js';
/** @internal */
const drawElemFs = {
    oneProng: drawOneProng,
    // oneProngAtDullCorner,
    // csf,
    twoProng: drawTwoProng(false, true),
    threeProng: drawThreeProng,
    boundingHull,
    looseBoundingBox,
    tightBoundingBox,
    // sharpCorner,
    // dullCorner,
    vertex,
    mat: drawMat,
    // sat: drawMat('sat'),
    maxVertex,
    leaves: drawLeaves,
    cull: drawCull,
    cpNode: drawCpNode,
    branch: drawBranch,
    holeCloser: drawTwoProng(false, false),
    speed: drawSpeed
};
const drawElemFsDetailed = {
    ...drawElemFs,
    twoProng: drawTwoProng(true, true),
};
export { drawElemFs, drawElemFsDetailed };
//# sourceMappingURL=draw-elem.js.map