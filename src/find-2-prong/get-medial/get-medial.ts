import type { CurvePiece  } from '../../mat/curve-piece.js';
import type { PointOnShape } from '../../point-on-shape/point-on-shape.js';
import { createPos } from '../../point-on-shape/create-pos.js';
import { getClosestPoint } from './get-closest-points.js';
import { eps } from 'flo-poly';
import { MedialPointInfo } from './medial-point-info.js';


/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given 
 * bezier pieces, including the beziers actually checked after culling.
 * 
 * @param pow
 * @param curvePieces
 * @param nnorm
 * @param yPos
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`
 */
function getMedial(
        pow: number,
        nnorm: number[], 
        yPos: PointOnShape,
        for1Prong: boolean,
        angle: number,
        curvePieces: CurvePiece[]): { xs: number[][]; _zs: PointOnShape[]; ds: number[] } {

    const pInfoss: MedialPointInfo[] = [];
    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];

        const pInfos = getClosestPoint(
            pow, nnorm, yPos, for1Prong, angle,
            curvePiece
        );

        if (pInfos === undefined) { continue; }
        pInfoss.push(...pInfos);
    }


    /** the minimum max value */
    let minMax = Infinity;
    for (let i=0; i<pInfoss.length; i++) {
        const diMax = pInfoss[i].d*(1 + 2**-46);
        if (diMax < minMax) {
            minMax = diMax;
        }
    }

    const closestPointInfos: MedialPointInfo[] = [];

    for (let i=0; i<pInfoss.length; i++) {
        const info = pInfoss[i];
        const d = info.d*(1 - 2**-46);
        if (d <= minMax) {
            closestPointInfos.push(info);
        }
    }

    if (closestPointInfos.length > 1) {
        // console.log(for1Prong);
        // console.log(angle);
        // console.log(nnorm);
        // console.log(yPos);
        // console.log(closestPointInfos);
    }
    
    // TODO - if _zs > 1, then we should skip the two-prong procedure since it is at the
    // exact spot where a 3+-prong is located.
    const _zs = closestPointInfos.map(info => createPos(info.curve, info.s, false))
    const xs = closestPointInfos.map(info => {
        return info.x;
    });
    const ds = closestPointInfos.map(info => {
        return info.d;
    });

    return { xs, _zs, ds };
}


export { getMedial }
