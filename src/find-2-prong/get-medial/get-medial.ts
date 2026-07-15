import type { CurvePiece  } from '../../mat/curve-piece.js';
import type { PointOnShape, PrePointOnShape } from '../../point-on-shape/point-on-shape.js';
import { /*createPos,*/ toP } from '../../point-on-shape/create-pos.js';
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
        maxCoordPowerOf2: number,
        nnorm: number[], 
        yPos: PrePointOnShape,
        for1Prong: boolean,
        angle: number,
        curvePieces: CurvePiece[]): { xs: number[][]; _zs: PrePointOnShape[]; ds: number[] } {

    const pInfoss: MedialPointInfo[] = [];
    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];

        const pInfos = getClosestPoint(
            maxCoordPowerOf2, nnorm, yPos, for1Prong, angle,
            curvePiece
        );

        if (pInfos === undefined) {
            continue;
        }
        pInfoss.push(...pInfos);
    }
    // if (yPos.t === 0 && angle === 0 && yPos.p[0] === 557.7511111099739 && yPos.p[1] === 1629.2530999999726) {
    //     // console.log(for1Prong);
    //     // console.log(angle);
    //     // console.log(nnorm);
    //     console.log(angle);
    //     console.log(curvePieces);
    //     console.log(yPos);
    //     console.log('-----');
    // }


    /** the minimum max value */
    let minMax = Infinity;
    for (let i=0; i<pInfoss.length; i++) {
        const diMax = pInfoss[i].d*(1 + 2**-46);  // TODO (and below) - use maxCoordPowerOf2
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

    // if (closestPointInfos.length > 1) {
    //     // console.log(for1Prong);
    //     // console.log(angle);
    //     // console.log(nnorm);
    //     console.log(yPos);
    //     console.log(closestPointInfos);
    //     console.log(toP(closestPointInfos[0].curve.ps, closestPointInfos[0].s))
    //     console.log(toP(closestPointInfos[1].curve.ps, closestPointInfos[1].s))
    //     console.log('-----');
    // }
    
    // TODO - if _zs > 1, then we should skip the two-prong procedure since it is at the
    // exact spot where a 3+-prong is located.
    const _zs: PrePointOnShape[] = closestPointInfos.map(info => 
        // createPos(info.curve, info.s, false)
        ({ curve: info.curve, t: info.s, isSource: false, p: toP(info.curve.ps, info.s)  })
    )
    const xs = closestPointInfos.map(info => {
        return info.x;
    });
    const ds = closestPointInfos.map(info => {
        return info.d;
    });

    return { xs, _zs, ds };
}


export { getMedial }
