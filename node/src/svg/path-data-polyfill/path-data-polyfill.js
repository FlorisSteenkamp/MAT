"use strict";
// @info
//   Polyfill for SVG 2 getPathData() and setPathData() methods. Based on:
//   - SVGPathSeg polyfill by Philip Rogers (MIT License)
//     https://github.com/progers/pathseg
//   - SVGPathNormalizer by Tadahisa Motooka (MIT License)
//     https://github.com/motooka/SVGPathNormalizer/tree/master/src
//   - arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
//     https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.core.js#L1837
// @author
//   Jarosław Foksa
// @license
//   MIT License
Object.defineProperty(exports, "__esModule", { value: true });
const parse_path_data_string_1 = require("./parse-path-data-string");
exports.parsePathDataString = parse_path_data_string_1.parsePathDataString;
const absolutize_path_data_1 = require("./absolutize-path-data");
const reduce_path_data_1 = require("./reduce-path-data");
const isIE = window.navigator.userAgent.indexOf("MSIE ") !== -1;
function pathDataPolyFill() {
    if (!SVGPathElement.prototype.getPathData ||
        !SVGPathElement.prototype.setPathData) {
        applyPolyFill();
    }
}
exports.pathDataPolyFill = pathDataPolyFill;
function clonePathData(pathData) {
    return pathData.map((seg) => ({ type: seg.type, values: seg.values.slice() }));
}
;
function applyPolyFill() {
    let setAttribute = SVGPathElement.prototype.setAttribute;
    let removeAttribute = SVGPathElement.prototype.removeAttribute;
    let $cachedPathData = Symbol();
    let $cachedNormalizedPathData = Symbol();
    SVGPathElement.prototype.setAttribute = function (name, value) {
        let elem = this; // This SVGPathElement            
        if (name === "d") {
            elem[$cachedPathData] = null;
            elem[$cachedNormalizedPathData] = null;
        }
        setAttribute.call(this, name, value);
    };
    SVGPathElement.prototype.removeAttribute = function (name) {
        let elem = this; // This SVGPathElement            
        if (name === "d") {
            elem[$cachedPathData] = null;
            elem[$cachedNormalizedPathData] = null;
        }
        removeAttribute.call(this, name);
    };
    SVGPathElement.prototype.getPathData = function (options) {
        let elem = this; // This SVGPathElement
        if (options && options.normalize) {
            if (elem[$cachedNormalizedPathData]) {
                return clonePathData(elem[$cachedNormalizedPathData]);
            }
            else {
                let pathData;
                if (elem[$cachedPathData]) {
                    pathData = clonePathData(elem[$cachedPathData]);
                }
                else {
                    pathData = parse_path_data_string_1.parsePathDataString(elem.getAttribute("d"));
                    elem[$cachedPathData] = clonePathData(pathData);
                }
                let normalizedPathData = reduce_path_data_1.reducePathData(absolutize_path_data_1.absolutizePathData(pathData));
                elem[$cachedNormalizedPathData] = clonePathData(normalizedPathData);
                return normalizedPathData;
            }
        }
        else {
            if (elem[$cachedPathData]) {
                return clonePathData(elem[$cachedPathData]);
            }
            else {
                let pathData = parse_path_data_string_1.parsePathDataString(elem.getAttribute("d"));
                elem[$cachedPathData] = clonePathData(pathData);
                return pathData;
            }
        }
    };
    SVGPathElement.prototype.setPathData = function (pathData) {
        let elem = this; // This SVGPathElement
        if (!pathData.length) {
            if (isIE) {
                // @bugfix https://github.com/mbostock/d3/issues/1737
                elem.setAttribute("d", "");
            }
            else {
                elem.removeAttribute("d");
            }
            return;
        }
        let d = '';
        let spacer = '';
        for (let i = 0; i < pathData.length; i++) {
            let seg = pathData[i];
            d = d + spacer + seg.type;
            spacer = ' ';
            if (seg.values.length) {
                d += " " + seg.values.join(" ");
            }
        }
        elem.setAttribute("d", d);
    };
}
// 1073 
