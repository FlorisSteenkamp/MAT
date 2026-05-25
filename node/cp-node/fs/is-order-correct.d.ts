import type { CpNode } from "../cp-node.js";
import { LlRbTree } from "flo-ll-rb-tree";
import { ContactPoint } from "../../contact-point/contact-point.js";
declare function isOrderCorrect(cpTree: LlRbTree<CpNode>, cp: ContactPoint, next: CpNode): boolean;
export { isOrderCorrect };
