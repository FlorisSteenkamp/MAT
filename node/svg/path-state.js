"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathState {
    constructor() {
        this.initialPoint = undefined;
        // Used in conjunction with "S" and "s"
        this.prev2ndCubicControlPoint = undefined;
        this.prev2ndQuadraticControlPoint = undefined;
        this.p = [0, 0];
    }
}
exports.PathState = PathState;
//# sourceMappingURL=path-state.js.map