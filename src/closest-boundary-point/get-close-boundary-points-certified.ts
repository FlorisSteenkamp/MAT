import type { CurvePiece  } from '../mat/curve-piece.js';
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { getPotentialClosestPointsOnCurveCertified } from './get-potential-closest-points-on-curve-certified.js';
import { cullCurvePieces1 } from './cull-bezier-pieces-1.js';
import { toP } from '../point-on-shape/to-p.js';


/**
 * Returns the closest boundary point to the given point, limited to the given 
 * bezier pieces, including the beziers actually checked after culling.
 * 
 * @param maxCoordPowerOf2
 * @param curvePieces
 * @param x
 * 
 * @internal
 */
function getCloseBoundaryPointsCertified(
        maxCoordPowerOf2: number,
        curvePieces: CurvePiece[], 
        x: number[]): PrePointOnShape[] {
    
    curvePieces = cullCurvePieces1(curvePieces, x);
 
    const pInfos: FootAndEndpointInfo[] = [];
    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];

        const _pInfos = getPotentialClosestPointsOnCurveCertified(
            maxCoordPowerOf2,
            curvePiece.curve, 
            x, 
            curvePiece.ts as [number,number]
        );

        pInfos.push(..._pInfos);
    }

    /** the minimum max interval value */
    let minMax = Infinity;
    for (let i=0; i<pInfos.length; i++) {
        const diMax = pInfos[i].dSquaredI[1];
        if (diMax < minMax) {
            minMax = diMax;
        }
    }

    const closestPointInfos: FootAndEndpointInfo[] = [];

    for (let i=0; i<pInfos.length; i++) {
        const info = pInfos[i];
        if (info.dSquaredI[0] <= minMax) {
            closestPointInfos.push(info);
        }
    }

    return closestPointInfos.map(info => {
        const { curve, t } = info;
        const { ps } = curve;
        const p = toP(ps, t);
        
        return {
            p, t, curve, isSource: false
        };
    });
}


export { getCloseBoundaryPointsCertified };
