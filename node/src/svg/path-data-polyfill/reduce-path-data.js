"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arc_to_cubic_curves_1 = require("./arc-to-cubic-curves");
/**
 * Takes path data that consists only from absolute commands and returns path
 * data that consists only from "M", "L", "C" and "Z" commands.
 */
function reducePathData(pathData) {
    let reducedPathData = [];
    let lastType;
    let lastControlX;
    let lastControlY;
    let currentX;
    let currentY;
    let subpathX;
    let subpathY;
    pathData.forEach(function (seg) {
        if (seg.type === "M") {
            let x = seg.values[0];
            let y = seg.values[1];
            reducedPathData.push({ type: "M", values: [x, y] });
            subpathX = x;
            subpathY = y;
            currentX = x;
            currentY = y;
        }
        else if (seg.type === "C") {
            let x1 = seg.values[0];
            let y1 = seg.values[1];
            let x2 = seg.values[2];
            let y2 = seg.values[3];
            let x = seg.values[4];
            let y = seg.values[5];
            reducedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });
            lastControlX = x2;
            lastControlY = y2;
            currentX = x;
            currentY = y;
        }
        else if (seg.type === "L") {
            let x = seg.values[0];
            let y = seg.values[1];
            reducedPathData.push({ type: "L", values: [x, y] });
            currentX = x;
            currentY = y;
        }
        else if (seg.type === "H") {
            let x = seg.values[0];
            reducedPathData.push({ type: "L", values: [x, currentY] });
            currentX = x;
        }
        else if (seg.type === "V") {
            let y = seg.values[0];
            reducedPathData.push({ type: "L", values: [currentX, y] });
            currentY = y;
        }
        else if (seg.type === "S") {
            let x2 = seg.values[0];
            let y2 = seg.values[1];
            let x = seg.values[2];
            let y = seg.values[3];
            let cx1;
            let cy1;
            if (lastType === "C" || lastType === "S") {
                cx1 = currentX + (currentX - lastControlX);
                cy1 = currentY + (currentY - lastControlY);
            }
            else {
                cx1 = currentX;
                cy1 = currentY;
            }
            reducedPathData.push({ type: "C", values: [cx1, cy1, x2, y2, x, y] });
            lastControlX = x2;
            lastControlY = y2;
            currentX = x;
            currentY = y;
        }
        else if (seg.type === "T") {
            let x = seg.values[0];
            let y = seg.values[1];
            let x1;
            let y1;
            if (lastType === "Q" || lastType === "T") {
                x1 = currentX + (currentX - lastControlX);
                y1 = currentY + (currentY - lastControlY);
            }
            else {
                x1 = currentX;
                y1 = currentY;
            }
            let cx1 = currentX + 2 * (x1 - currentX) / 3;
            let cy1 = currentY + 2 * (y1 - currentY) / 3;
            let cx2 = x + 2 * (x1 - x) / 3;
            let cy2 = y + 2 * (y1 - y) / 3;
            reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });
            lastControlX = x1;
            lastControlY = y1;
            currentX = x;
            currentY = y;
        }
        else if (seg.type === "Q") {
            let x1 = seg.values[0];
            let y1 = seg.values[1];
            let x = seg.values[2];
            let y = seg.values[3];
            let cx1 = currentX + 2 * (x1 - currentX) / 3;
            let cy1 = currentY + 2 * (y1 - currentY) / 3;
            let cx2 = x + 2 * (x1 - x) / 3;
            let cy2 = y + 2 * (y1 - y) / 3;
            reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });
            lastControlX = x1;
            lastControlY = y1;
            currentX = x;
            currentY = y;
        }
        else if (seg.type === "A") {
            let r1 = seg.values[0];
            let r2 = seg.values[1];
            let angle = seg.values[2];
            let largeArcFlag = seg.values[3];
            let sweepFlag = seg.values[4];
            let x = seg.values[5];
            let y = seg.values[6];
            if (r1 === 0 || r2 === 0) {
                reducedPathData.push({ type: "C", values: [currentX, currentY, x, y, x, y] });
                currentX = x;
                currentY = y;
            }
            else {
                if (currentX !== x || currentY !== y) {
                    let curves = arc_to_cubic_curves_1.arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag, undefined);
                    curves.forEach(function (curve) {
                        reducedPathData.push({ type: "C", values: curve });
                        currentX = x;
                        currentY = y;
                    });
                }
            }
        }
        else if (seg.type === "Z") {
            reducedPathData.push(seg);
            currentX = subpathX;
            currentY = subpathY;
        }
        lastType = seg.type;
    });
    return reducedPathData;
}
exports.reducePathData = reducePathData;
