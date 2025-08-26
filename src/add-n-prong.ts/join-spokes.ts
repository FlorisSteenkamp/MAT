import { CpNode } from "../cp-node/cp-node.js";
import { Circle } from "../geometry/circle.js";


function joinSpokes(
        circle: Circle,
        cpNodes: CpNode[]) {

    cpNodes = cpNodes.slice().sort(byAngle(circle));

    const len = cpNodes.length;
    for (let i=0; i<len; i++) {
        cpNodes[i].nextOnCircle = cpNodes[(i + 1)%len];
        cpNodes[i].prevOnCircle = cpNodes[(i - 1 + len)%len];
    }
}


/** @internal */
function byAngle(circle: Circle) {
	const c = circle.center;

	return function(_a: CpNode, _b: CpNode) {
		let a = _a.cp.pointOnShape.p;
		let b = _b.cp.pointOnShape.p;

		// Move onto origin
		a = [a[0] - c[0], a[1] - c[1]];
		b = [b[0] - c[0], b[1] - c[1]];

		const a_ = Math.atan2(a[1], a[0]);
		const b_ = Math.atan2(b[1], b[0]);

		return b_ - a_;
	}
}


export { joinSpokes }
