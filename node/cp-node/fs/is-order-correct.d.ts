import { LlRbTree } from "flo-ll-rb-tree";
import { ContactPoint } from "../../contact-point/contact-point.js";
import { CpNode } from "../cp-node.js";
declare function isOrderCorrect(cpTree: LlRbTree<CpNode>, cp: ContactPoint, next: CpNode): boolean;
export { isOrderCorrect };
