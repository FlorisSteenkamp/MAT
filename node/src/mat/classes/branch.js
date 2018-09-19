"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO - maybe make branches such that it gives the to AND from MatCircle
// TODO - drop MatNode
class Branch {
    constructor(matCircle, 
        //matNode : MatNode,
        fromCp, toCp) {
        this.matCircle = matCircle;
        //this.matNode = matNode;
        this.fromCp = fromCp;
        this.toCp = toCp;
    }
}
exports.Branch = Branch;
