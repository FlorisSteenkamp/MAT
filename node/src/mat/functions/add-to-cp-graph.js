"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("../classes/contact-point");
const cp_graph_1 = require("../../linked-list/cp-graph");
function addToCpGraph(circle, orders, cpGraphs, poss) {
    let newCps = poss.map((pos, i) => {
        let cpGraph = cpGraphs.get(pos.bezierNode.loop);
        let newCp_ = new contact_point_1.ContactPoint(pos, circle, orders[i], 0);
        let neighboringCp = cp_graph_1.CpGraph.getNeighbouringPoints(cpGraph, pos, orders[i], 0);
        let newCp = cpGraph.insert(newCp_, neighboringCp[0]);
        return newCp;
    });
    let len = poss.length;
    for (let i = 0; i < len; i++) {
        let indxPrev = i === 0 ? len - 1 : i - 1;
        let indxNext = i === len - 1 ? 0 : i + 1;
        newCps[i].prevOnCircle = newCps[indxPrev];
        newCps[i].nextOnCircle = newCps[indxNext];
    }
}
exports.addToCpGraph = addToCpGraph;
