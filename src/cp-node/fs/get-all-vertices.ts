import { CpNode } from "../cp-node.js";
import { traverseVertices } from "./traverse-vertices.js";


function getAllVertices(
        cpNode: CpNode) {

    const vertices: CpNode[] = [];
    traverseVertices(cpNode, cpNode => {
        vertices.push(cpNode);
    });

    return vertices;
}


export { getAllVertices }
