"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_beziers_from_raw_paths_1 = require("./get-beziers-from-raw-paths");
const loop_1 = require("../../loop");
const parse_path_data_string_1 = require("../path-data-polyfill/parse-path-data-string");
function getPathsFromSvgPathElem(elem) {
    let rawPaths = parse_path_data_string_1.parsePathDataString(elem.getAttribute("d"));
    return get_beziers_from_raw_paths_1.getBeziersFromRawPaths(rawPaths).map(path => new loop_1.Loop(path));
}
exports.getPathsFromSvgPathElem = getPathsFromSvgPathElem;
