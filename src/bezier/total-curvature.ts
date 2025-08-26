import { totalCurvature } from "flo-bezier3";
import { memoize } from "flo-memoize";


const totalCurvature$ = memoize(totalCurvature);


export { totalCurvature$ }
