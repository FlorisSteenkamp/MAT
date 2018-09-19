"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_beziers_from_raw_paths_1 = require("./get-beziers-from-raw-paths");
const loop_1 = require("../../loop");
const parse_path_data_string_1 = require("../path-data-polyfill/parse-path-data-string");
function getPathsFromStr(str) {
    let bezierLoops = get_beziers_from_raw_paths_1.getBeziersFromRawPaths(parse_path_data_string_1.parsePathDataString(str));
    //---- For debugging ----//
    // TODO
    //console.log(paths);
    /*
    let pathsStr = '';
    for (let i=0; i<bezierLoops.length; i++) {
        let bezierLoop = bezierLoops[i];

        pathsStr += beziersToSvgPathStr(bezierLoop) + '\n';
    }
    console.log(pathsStr);
    */
    //-----------------------//
    return bezierLoops.map(path => new loop_1.Loop(path));
}
exports.getPathsFromStr = getPathsFromStr;
