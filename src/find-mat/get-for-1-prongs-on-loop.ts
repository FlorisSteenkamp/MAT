import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { getCurvatureExtremaDd, controlPointLinesLength } from 'flo-bezier3';
import { toP } from '../point-on-shape/to-p.js';


/**
 * Get points of maximum curvature.
 * 
 * @param loop
 * 
 * @internal
 */
function getFor1ProngsOnLoop(
        minBezLength: number) {

    return function(loop: Loop) {
        const poss: PrePointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }

            const { ps } = curve;

            poss.push(...getCurvatureExtremaDd(ps).maxima.map(t => {
                const pDd = toP(ps, t);
                const p = pDd.map(c => c[0] + c[1]);

                return { curve, t, isSource: true, p, pDd }
            }));
        }

        return poss;
    }
}


export { getFor1ProngsOnLoop }
