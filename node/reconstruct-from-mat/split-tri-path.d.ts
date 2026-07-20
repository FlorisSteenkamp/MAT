import type { BezierPiece } from 'flo-bezier3';
import type { MatchedBeziers } from './matched-beziers.js';
declare function splitTriPath(boundaryBeziers: BezierPiece[], medialBezier: BezierPiece, boundaryBeziersOpp: BezierPiece[] | undefined): MatchedBeziers[];
declare function getCumLengths(lens: number[]): number[];
export { splitTriPath, getCumLengths };
