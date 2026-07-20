import type { BezierPiece } from 'flo-bezier3';
/**
 * A type representing a correspondence between 3 bezier curves (one on the
 * boundary, one on the medial axis and one on the opposite boundary)
 */
interface MatchedBeziers {
    readonly medialBezier: BezierPiece;
    readonly boundaryBezier: BezierPiece;
}
export type { MatchedBeziers };
