import { loopFromBeziers } from "flo-boolean";
function loopFromStringifyable(loopStringifyable) {
    const { idx, beziers } = loopStringifyable;
    return loopFromBeziers(beziers, idx);
}
export { loopFromStringifyable };
//# sourceMappingURL=loop-from-stringifyable.js.map