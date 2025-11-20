import { traverseVertices } from "./traverse-vertices.js";
function getAllVertices(cpNode) {
    const vertices = [];
    traverseVertices(cpNode, cpNode => {
        vertices.push(cpNode);
    });
    return vertices;
}
export { getAllVertices };
//# sourceMappingURL=get-all-vertices.js.map