"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
/**
 * @hidden
 * @param string
 */
function parsePathDataString(string) {
    if (!string.length)
        return [];
    let source = new source_1.Source(string);
    let pathData = [];
    if (!source.initialCommandIsMoveTo()) {
        return [];
    }
    while (source.hasMoreData()) {
        let pathSeg = source.parseSegment();
        if (pathSeg === null) {
            break;
        }
        else {
            pathData.push(pathSeg);
        }
    }
    return pathData;
}
exports.parsePathDataString = parsePathDataString;
//# sourceMappingURL=parse-path-data-string.js.map