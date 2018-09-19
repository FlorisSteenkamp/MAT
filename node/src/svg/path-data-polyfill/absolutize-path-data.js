"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @info
//   Takes any path data, returns path data that consists only from absolute commands.
function absolutizePathData(pathData) {
    let absolutizedPathData = [];
    let currentX = null;
    let currentY = null;
    let subpathX = null;
    let subpathY = null;
    pathData.forEach(function (seg) {
        let type = seg.type;
        if (type === "M") {
            let x = seg.values[0];
            let y = seg.values[1];
            absolutizedPathData.push({ type: "M", values: [x, y] });
            subpathX = x;
            subpathY = y;
            currentX = x;
            currentY = y;
        }
        else if (type === "m") {
            let x = currentX + seg.values[0];
            let y = currentY + seg.values[1];
            absolutizedPathData.push({ type: "M", values: [x, y] });
            subpathX = x;
            subpathY = y;
            currentX = x;
            currentY = y;
        }
        else if (type === "L") {
            let x = seg.values[0];
            let y = seg.values[1];
            absolutizedPathData.push({ type: "L", values: [x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "l") {
            let x = currentX + seg.values[0];
            let y = currentY + seg.values[1];
            absolutizedPathData.push({ type: "L", values: [x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "C") {
            let x1 = seg.values[0];
            let y1 = seg.values[1];
            let x2 = seg.values[2];
            let y2 = seg.values[3];
            let x = seg.values[4];
            let y = seg.values[5];
            absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "c") {
            let x1 = currentX + seg.values[0];
            let y1 = currentY + seg.values[1];
            let x2 = currentX + seg.values[2];
            let y2 = currentY + seg.values[3];
            let x = currentX + seg.values[4];
            let y = currentY + seg.values[5];
            absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "Q") {
            let x1 = seg.values[0];
            let y1 = seg.values[1];
            let x = seg.values[2];
            let y = seg.values[3];
            absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "q") {
            let x1 = currentX + seg.values[0];
            let y1 = currentY + seg.values[1];
            let x = currentX + seg.values[2];
            let y = currentY + seg.values[3];
            absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "A") {
            let x = seg.values[5];
            let y = seg.values[6];
            absolutizedPathData.push({
                type: "A",
                values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
            });
            currentX = x;
            currentY = y;
        }
        else if (type === "a") {
            let x = currentX + seg.values[5];
            let y = currentY + seg.values[6];
            absolutizedPathData.push({
                type: "A",
                values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
            });
            currentX = x;
            currentY = y;
        }
        else if (type === "H") {
            let x = seg.values[0];
            absolutizedPathData.push({ type: "H", values: [x] });
            currentX = x;
        }
        else if (type === "h") {
            let x = currentX + seg.values[0];
            absolutizedPathData.push({ type: "H", values: [x] });
            currentX = x;
        }
        else if (type === "V") {
            let y = seg.values[0];
            absolutizedPathData.push({ type: "V", values: [y] });
            currentY = y;
        }
        else if (type === "v") {
            let y = currentY + seg.values[0];
            absolutizedPathData.push({ type: "V", values: [y] });
            currentY = y;
        }
        else if (type === "S") {
            let x2 = seg.values[0];
            let y2 = seg.values[1];
            let x = seg.values[2];
            let y = seg.values[3];
            absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "s") {
            let x2 = currentX + seg.values[0];
            let y2 = currentY + seg.values[1];
            let x = currentX + seg.values[2];
            let y = currentY + seg.values[3];
            absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "T") {
            let x = seg.values[0];
            let y = seg.values[1];
            absolutizedPathData.push({ type: "T", values: [x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "t") {
            let x = currentX + seg.values[0];
            let y = currentY + seg.values[1];
            absolutizedPathData.push({ type: "T", values: [x, y] });
            currentX = x;
            currentY = y;
        }
        else if (type === "Z" || type === "z") {
            absolutizedPathData.push({ type: "Z", values: [] });
            currentX = subpathX;
            currentY = subpathY;
        }
    });
    return absolutizedPathData;
}
exports.absolutizePathData = absolutizePathData;
