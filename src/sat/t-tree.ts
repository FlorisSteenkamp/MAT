import { Circle } from '../geometry/circle.js';


/** @internal */
export type TTree = {
    trees?: Map<number,TTree>,
    circles?: Set<Circle>
}
