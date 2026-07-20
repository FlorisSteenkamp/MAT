import type { BezierPiece } from 'flo-bezier3';
import type { CpNode } from '../cp-node/cp-node.js';
declare function getBoundary(cpNode: CpNode): {
    boundaryBeziers: BezierPiece[];
    boundaryBeziersOpp: BezierPiece[] | undefined;
};
export { getBoundary };
