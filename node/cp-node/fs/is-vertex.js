import { getAllOnCircle } from "./get-all-on-circle.js";
function isVertex(f) {
    return (cpNode) => getAllOnCircle(cpNode).some(f);
}
export { isVertex };
//# sourceMappingURL=is-vertex.js.map