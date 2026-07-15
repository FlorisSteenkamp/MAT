import type { CpNode } from "../cp-node/cp-node.js";
import type { Circle } from "../geometry/circle.js";
import type { Mutable } from "../utils/mutable.js";


function joinSpokes(
        circle: Circle,
        cpNodes: CpNode[]) {

    cpNodes = cpNodes.slice().sort(byAngle(circle));

    const len = cpNodes.length;
    for (let i=0; i<len; i++) {
        const cpNode = cpNodes[i] as Mutable<CpNode>;
        cpNode.nextOnCircle = cpNodes[(i + 1)%len];
        cpNode.prevOnCircle = cpNodes[(i - 1 + len)%len];
    }
}


/** @internal */
function byAngle(circle: Circle) {
    const c = circle.center;

    return function(_a: CpNode, _b: CpNode) {
        let a = _a.pointOnShape.p;
        let b = _b.pointOnShape.p;

        // Move onto origin
        a = [a[0] - c[0], a[1] - c[1]];
        b = [b[0] - c[0], b[1] - c[1]];

        const a_ = Math.atan2(a[1], a[0]);
        const b_ = Math.atan2(b[1], b[0]);

        return b_ - a_;
    }
}


export { joinSpokes }
