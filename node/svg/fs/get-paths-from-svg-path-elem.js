"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_paths_from_str_1 = require("./get-paths-from-str");
function getPathsFromSvgPathElem(elem) {
    return get_paths_from_str_1.getPathsFromStr(elem.getAttribute("d"));
}
exports.getPathsFromSvgPathElem = getPathsFromSvgPathElem;
//# sourceMappingURL=get-paths-from-svg-path-elem.js.map