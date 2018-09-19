"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLargestVertex(circles) {
    return circles.reduce(function (maxCircle, circle) {
        return maxCircle.radius >= circle.radius
            ? maxCircle
            : circle;
    }, circles[0]);
}
exports.getLargestVertex = getLargestVertex;
