function joinSpokes(circle, cpNodes) {
    cpNodes = cpNodes.slice().sort(byAngle(circle));
    const len = cpNodes.length;
    for (let i = 0; i < len; i++) {
        const cpNode = cpNodes[i];
        cpNode.nextOnCircle = cpNodes[(i + 1) % len];
        cpNode.prevOnCircle = cpNodes[(i - 1 + len) % len];
    }
}
/** @internal */
function byAngle(circle) {
    const c = circle.center;
    return function (_a, _b) {
        let a = _a.pointOnShape.p;
        let b = _b.pointOnShape.p;
        // Move onto origin
        a = [a[0] - c[0], a[1] - c[1]];
        b = [b[0] - c[0], b[1] - c[1]];
        const a_ = Math.atan2(a[1], a[0]);
        const b_ = Math.atan2(b[1], b[0]);
        return b_ - a_;
    };
}
export { joinSpokes };
//# sourceMappingURL=join-spokes.js.map