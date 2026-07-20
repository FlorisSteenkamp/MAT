import type { BezierPiece } from 'flo-bezier3';
import type { MatchedBeziers } from './matched-beziers.js';
import { getTAtLength } from 'flo-bezier3';
import { sum } from '../utils/sum.js';
import { clip } from '../utils/clip.js';
import { getBezierPieceLength } from './get-bezier-piece-length.js';


const EPS = 1e-9;


function splitTriPath(
        boundaryBeziers: BezierPiece[],
        medialBezier: BezierPiece,
        boundaryBeziersOpp: BezierPiece[] | undefined): MatchedBeziers[] {

    const _boundaryBeziersOpp = boundaryBeziersOpp ?? [];

    const boundaryBeziersOpp_ =
        _boundaryBeziersOpp.map(reverseBezierPiece).toReversed();

    // Importantly, we need to split on boundaryBeziersOpp_ as well, to ensure
    // the number of returned pieces is the same for both sides, so that they
    // can be interpolated.
    const _paths = boundaryBeziersOpp_.length > 0
        ? [boundaryBeziers, [medialBezier], boundaryBeziersOpp_]
        : [boundaryBeziers, [medialBezier]];

    const paths = splitTriPath_(_paths);

    const matchedBezierss: MatchedBeziers[] = [];
    for (let i=0; i<paths.length; i++) {
        const path = paths[i];
        // const pathOpp = paths[paths.length - 1 - i];

        const [boundaryBezier, medialBezier] = path;
        // const boundaryBezierOpp = pathOpp[2];
        const matchedBeziers: MatchedBeziers = {
            boundaryBezier,
            medialBezier,
            // boundaryBezierOpp
        };
        matchedBezierss.push(matchedBeziers);
    }

    return matchedBezierss;
}


function reverseBezierPiece(
        bezierPiece: BezierPiece) {

    const { ps, ts: [tS, tE] } = bezierPiece;

    return {
        ps: ps.toReversed(),
        ts: [1 - tE, 1 - tS]
    };
}


/**
 * Returns an array of arrays of `BezierPiece`s, where each inner array
 * contains `BezierPiece`s that correspond to each other across the different
 * paths by normalized length.
 * 
 * For example, if there are 3 paths, then each inner array will contain 3
 * `BezierPiece`s, one from each path, that correspond to each other by normalized
 * length.
 * 
 * @param bezierPiecess 
 */
function splitTriPath_(
        bezierPiecess: BezierPiece[][]): BezierPiece[][] {

    const lenss = mapmap(bezierPiecess, getBezierPieceLength);
    const lens = lenss.map(sum);
    const cums = lenss.map(getCumLengths);

    const normCums = cums.map((cum,i) => {
        const len = lens[i];
        if (len <= EPS) {
            return cum.map((_,j) => j === 0 ? 0 : 1);
            // return cum.map(() => Number.POSITIVE_INFINITY);
        }

        return cum.map(l => l/len);
    });


    /** Current position of start t */
    let ts = new Array(bezierPiecess.length).fill(0);
    /** Current position of i */
    let is = new Array(bezierPiecess.length).fill(0);

    const matchedBezierss: BezierPiece[][] = [];

    normCums;//?

    let ii = 0;
    const maxIterations = 100;
    while (ts.some(t => t < 1) && ii++ < maxIterations) {
        const normCumsNext: number[] = [];
        for (let k=0; k<bezierPiecess.length; k++) {
            const i_ = is[k];

            const normCum_ = normCums[k][i_ + 1];//?
            const normCum = normCum_ === undefined
                ? Number.POSITIVE_INFINITY
                : normCum_;

            normCumsNext.push(normCum);
        }

        normCumsNext;//?

        const minIdx = getMinIdx(normCumsNext)!;//?
        const idxs = getIdxs(normCumsNext, normCumsNext[minIdx]);//?
        const curCum = normCumsNext[minIdx];

        // if (idxs.length === 0) {
        //     throw new Error('splitTriPath_: unable to make progress');
        // }

        const nextPieces: BezierPiece[] = new Array(bezierPiecess.length).fill([]);
        for (let m=0; m<bezierPiecess.length; m++) {
            const bezierPieces = bezierPiecess[m];
            const _i = is[m];

            // This path is already finished; keep emitting a degenerate tail.
            if (_i >= bezierPieces.length) {
                const lastBezierPiece = bezierPieces[bezierPieces.length - 1];
                nextPieces[m] = {
                    ps: lastBezierPiece.ps,
                    ts: [1, 1]
                };
                ts[m] = 1;
                continue;
            }

            if (idxs.includes(m)) {
                const _t = ts[m];
                const bezierPiece = bezierPieces[_i];
                const [pieceTS, pieceTE] = bezierPiece.ts;
                const pieceDt = pieceTE - pieceTS;

                nextPieces[m] = {
                    ps: bezierPiece.ps,
                    ts: [pieceTS + _t*pieceDt, pieceTE]
                };

                const nextI = _i + 1;
                is[m] = nextI;
                ts[m] = nextI >= bezierPieces.length ? 1 : 0;
            } else {
                const _t = ts[m];
                const bezierPiece = bezierPieces[_i];
                const [pieceTS, pieceTE] = bezierPiece.ts;
                const pieceDt = pieceTE - pieceTS;
                const bezierLen = getBezierPieceLength({ ps: bezierPiece.ps, ts: [0, 1] });

                const normCumStart = normCums[m][_i];
                const normCumEnd = normCums[m][_i + 1];
                const normCumDt = normCumEnd - normCumStart;
                const normWithinPiece = normCumDt <= EPS
                    ? _t
                    : clip((curCum - normCumStart) / normCumDt, _t, 1);

                const t1 = bezierLen <= EPS
                    ? _t
                    : clip(getTAtLength(bezierPiece.ps, bezierLen * normWithinPiece), _t, 1);

                nextPieces[m] = {
                    ps: bezierPiece.ps,
                    ts: [pieceTS + _t*pieceDt, pieceTS + t1*pieceDt]
                };

                if (closeToEps(t1, 1)) {
                    const nextI = _i + 1;
                    is[m] = nextI;
                    ts[m] = nextI >= bezierPieces.length ? 1 : 0;
                } else {
                    is[m] = _i;
                    ts[m] = t1;
                }
            }
        }

        matchedBezierss.push(nextPieces);
    }

    if (ts.some(t => t < 1)) {
        throw new Error('splitTriPath_: exceeded maximum iterations');
    }

    return matchedBezierss;
}


function getCumLengths(lens: number[]) {
    const cum: number[] = [0];
    let cumLen = 0;
    for (let j=0; j<lens.length; j++) {
        cumLen += lens[j];
        cum.push(cumLen);
    }
    return cum;
}


/**
 * Returns the index within the given array of the number with the highest
 * value.
 * 
 * * returns `undefined` if the array is empty
 */
function getMinIdx(
        vs: number[]): number | undefined {

    let minIdx: number | undefined = undefined;
    let minVal = Number.POSITIVE_INFINITY;
    for (let i=0; i<vs.length; i++) {
        if (vs[i] <= minVal) {
            minVal = vs[i];
            minIdx = i;
        }
    }

    return minIdx;
}


/**
 * Returns the indices within the given array of the numbers that are equal to
 * the given max value (within an EPS value).
 * 
 * @param vs 
 * @param maxVal 
 */
function getIdxs(
        vs: number[],
        maxVal: number): number[] {

    const maxIdxs: number[] = [];
    for (let i=0; i<vs.length; i++) {
        if (vs[i] === maxVal || closeToEps(vs[i], maxVal)) {
            maxIdxs.push(i);
        }
    }

    return maxIdxs;
}


function closeToEps(a: number, b: number) {
    return Math.abs(a - b) <= EPS;
}


export { splitTriPath, getCumLengths };



// KEEP FOR TESTING! - one in opentype-ts doesn't work with tests due to aliases
function mapmap<T,U>(
        tss: T[][],
        f: (t: T) => U): U[][] {

    const tss_: U[][] = [];
    for (let i=0; i<tss.length; i++) {
        const ts = tss[i];
        const ts_: U[] = [];
        for (let j=0; j<ts.length; j++) {
            ts_.push(f(ts[j]));
        }
        tss_.push(ts_);
    }

    return tss_;
}
