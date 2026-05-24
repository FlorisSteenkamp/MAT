import type { Mat } from "../../src/mat/mat.js";
import { findMats } from "../../src/find-mat/find-mats.js";


/** mat-demo: "achispado" font, "comma" glyph */
const loops1 = [
    [
        [[139, 8], [82, -101]],
        [[82, -101], [24, 8]],
        [[24, 8], [46, 8]],
        [[46, 8], [46, 54]],
        [[46, 54], [117, 54]],
        [[117, 54], [117, 8]],
        [[117, 8], [139, 8]],
        [[139, 8], [139, 8]]
    ]
];


// Cache
let mats1: Mat[] | undefined = undefined;
function getMats1() {
    if (mats1) { return mats1; }

    mats1 = findMats(loops1, {
        applySat: false,
        simplify: true,
        satScale: 1.675,
        maxCurviness: 0.05,
        maxLength: 40,
        // maxCurviness: 5,
        // maxLength: 4000,
        angleIncrement: 15,
        simplifyTolerance: 2**-1
    });

    return mats1;
}


export { getMats1 }
