import type { Mat } from '../mat/mat.js';
import { findMats } from '../find-mat/find-mats.js';
import { removeSatInducedTrivial3Prongs } from "./remove-sat-induced-trivial-3prongs.js";
import { toScaleAxis } from '../sat/to-scale-axis.js';


/**
 * Returns the shape information.
 * 
 * @param font$$ the font from which the glyph outlines will be retrieved
 * @param glyphId the glyph id for which the shape is to be retrieved
 * @param options the options for SAT computation
 */
// TODO
function getSats2(
        mats: Mat[],
        satScale: number): Mat[] {

    const sats = mats.map(mat => toScaleAxis(mat, satScale));

    return sats.map(removeSatInducedTrivial3Prongs);
}


export { getSats2 }
