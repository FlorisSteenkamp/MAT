
import { Circle } from '../../circle';


export type TTree = {
    trees?: Map<number,TTree>,
    circles?: Set<Circle>
}
