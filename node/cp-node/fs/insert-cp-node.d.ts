import { LlRbTree } from "flo-ll-rb-tree";
import { ContactPoint } from "../../contact-point/contact-point.js";
import { CpNode } from "../cp-node.js";
declare function insertCpNode(insertIfOrderWrong: boolean, isHoleClosing: boolean, isIntersection: boolean, cpTree: LlRbTree<CpNode>, cp: ContactPoint, _prev: CpNode | undefined): CpNode | undefined;
export { insertCpNode };
