import { Loop } from "../../../loop/loop";
/** @hidden */
interface ILoopTree {
    parent: ILoopTree;
    children: Set<ILoopTree>;
    beziers: number[][][];
    loop: Loop;
    orientation: number;
    windingNum: number;
}
export { ILoopTree };
