import { getAllOnLoop } from "./get-all-on-loop.js";
function getHoleClosers(cpNode) {
    return getAllOnLoop(cpNode)
        .filter(cpNode => cpNode.isHoleClosing);
}
export { getHoleClosers };
//# sourceMappingURL=get-hole-closers.js.map