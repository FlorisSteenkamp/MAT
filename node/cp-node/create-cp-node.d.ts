import { ContactPoint } from '../contact-point/contact-point.js';
import { CpNode } from './cp-node.js';
declare function createCpNode(cp: ContactPoint, isHoleClosing: boolean, isIntersection: boolean, prev?: CpNode, next?: CpNode, prevOnCircle?: CpNode, nextOnCircle?: CpNode): CpNode;
export { createCpNode };
