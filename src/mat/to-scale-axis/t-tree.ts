import { Circle } from '../../circle.js';


/** @hidden */
export type TTree = {
    trees?: Map<number,TTree>,
    circles?: Set<Circle>
}
