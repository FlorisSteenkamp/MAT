/**
 * @param beziers A pre-ordered array of bezier curves to add initially.
 */
function loopFromBeziers(beziers = []) {
    const curves = [];
    const loop = {
        beziers,
        curves
    };
    if (!beziers.length) {
        return loop;
    }
    let prev;
    for (let i = 0; i < beziers.length; i++) {
        const curve = {
            loop,
            ps: beziers[i],
            prev,
            next: undefined,
            idx: i
        };
        if (prev) {
            prev.next = curve;
        }
        prev = curve;
        curves.push(curve);
    }
    // close loop
    const lastCurve = curves[curves.length - 1];
    curves[0].prev = lastCurve;
    lastCurve.next = curves[0];
    return loop;
}
export { loopFromBeziers };
//# sourceMappingURL=loop.js.map