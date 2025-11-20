import { getAllOnCircle } from "./get-all-on-circle.js";
function isOnSameCircle(cpNode1, cpNode2) {
    // const cpNodes = getAllOnCircle(cpNode1, true);
    const cpNodes = getAllOnCircle(cpNode1);
    return cpNodes.indexOf(cpNode2) >= 0;
}
export { isOnSameCircle };
//# sourceMappingURL=is-on-same-circle.js.map