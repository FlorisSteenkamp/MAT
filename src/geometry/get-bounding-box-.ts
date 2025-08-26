import { getBoundingBox } from "flo-bezier3";
import { memoize } from "flo-memoize";


const getBoundingBox$ = memoize(getBoundingBox);


export { getBoundingBox$ }
