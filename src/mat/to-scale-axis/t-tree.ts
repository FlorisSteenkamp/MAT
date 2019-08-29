
import { Circle } from '../../circle';


/** @hidden */
export type TTree = {
    trees?: Map<number,TTree>,
    circles?: Set<Circle>
}
