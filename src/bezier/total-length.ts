import { totalLength } from "flo-bezier3";
import { memoize } from "flo-memoize";


const totalLength$ = memoize(totalLength);


export { totalLength$ }
