import type { Mat } from "../src/mat/mat.js";
import { getPathsFromStr } from 'flo-boolean';
import { findMats } from "../src/find-mat/find-mats.js";


// Cache - the tests using this fixture must not mutate it.
let mats: Mat[] | undefined = undefined;

/**
 * A square with a square hole - forces hole-closing 2-prongs (which `getMats1`
 * does not have). Unlike `getMats1` this is calculated and thus susceptible to
 * small perturbations in the algorithm, so only test *structural* properties
 * against it.
 */
function getMatsWithHole(): Mat[] {
    if (mats) { return mats; }

    const loops = getPathsFromStr(
        'M0 0 L100 0 L100 100 L0 100 Z ' +
        'M30 30 L30 70 L70 70 L70 30 Z'
    );
    mats = findMats(loops, {});

    return mats;
}


export { getMatsWithHole }
