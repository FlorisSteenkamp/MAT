"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../../mat-constants");
const flo_bezier3_1 = require("flo-bezier3");
function addDebugInfo(bezierLoops) {
    for (let loop of bezierLoops) {
        let i = 0;
        loop.forEach(function (path) {
            let drawElem = _debug_.fs.drawElem;
            let ps = path.item;
            let hull = flo_bezier3_1.getBoundingHull(ps);
            let generated = _debug_.generated;
            generated.elems.boundingHulls.push({
                data: hull,
                $svg: drawElem.drawBoundingHull(hull, _debug_.config.toDraw.boundingHulls &&
                    _debug_.config.toDraw.boundingHulls[_debug_.fs.elemType.boundingHulls(hull)], i % 2 === 0 ? 'thin5 black nofill' : 'thin10 black nofill')
            });
            let looseBoundingBox = flo_bezier3_1.getBoundingBox(ps);
            generated.elems.looseBoundingBoxes.push({
                data: looseBoundingBox,
                $svg: drawElem.drawLooseBoundingBox(looseBoundingBox, _debug_.config.toDraw.looseBoundingBoxes &&
                    _debug_.config.toDraw.looseBoundingBoxes[_debug_.fs.elemType.looseBoundingBoxes(looseBoundingBox)])
            });
            let tightBoundingBox = flo_bezier3_1.getBoundingBoxTight(ps);
            generated.elems.tightBoundingBoxes.push({
                data: tightBoundingBox,
                $svg: drawElem.drawTightBoundingBox(tightBoundingBox, _debug_.config.toDraw.tightBoundingBoxes &&
                    _debug_.config.toDraw.tightBoundingBoxes[_debug_.fs.elemType.tightBoundingBoxes(looseBoundingBox)])
            });
            i++;
        });
    }
}
exports.addDebugInfo = addDebugInfo;
function addMoreDebugInfo(pointOnShapeArrPerLoop) {
    for (let pointsOnShape of pointOnShapeArrPerLoop) {
        for (let pos of pointsOnShape) {
            if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
                _debug_.generated.elems.sharpCorners.push({
                    data: { pos },
                    $svg: _debug_.fs.drawElem.drawSharpCorner(pos, _debug_.config.toDraw.sharpCorners &&
                        _debug_.config.toDraw.sharpCorners[_debug_.fs.elemType.sharpCorners({ pos })])
                });
            }
            else {
                if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.dull) {
                    _debug_.generated.elems.dullCorners.push({
                        data: { pos },
                        $svg: _debug_.fs.drawElem.drawDullCorner(pos, _debug_.config.toDraw.dullCorners &&
                            _debug_.config.toDraw.dullCorners[_debug_.fs.elemType.dullCorners({ pos })])
                    });
                }
            }
        }
    }
}
exports.addMoreDebugInfo = addMoreDebugInfo;
