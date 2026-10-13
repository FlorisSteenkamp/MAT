import { getBoundingBox, getBoundingBoxTight } from "flo-bezier3";
import { memoize } from "flo-memoize";


/** The (loose, axis-aligned) bounding box of a bezier curve - memoized on its control points. */
const getBoundingBox$ = memoize(getBoundingBox);
/** The tight (rotated) bounding box of a bezier curve - memoized on its control points. */
const getBoundingBoxTight$ = memoize(getBoundingBoxTight);


export { getBoundingBox$, getBoundingBoxTight$ }
