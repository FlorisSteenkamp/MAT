"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("../../debug");
function draw2Prong(twoProng, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    //let scaleFactor = width/200;		
    let scaleFactor = 1;
    let $failedDot = undefined;
    let $center = undefined;
    let $circle = undefined;
    let $cp1 = undefined;
    let $cp2 = undefined;
    let color;
    let thin;
    let draw = _debug_.fs.draw;
    switch (_debug_.fs.elemType.twoProngs(twoProng)) {
        case debug_1.ElemType_TwoProng.failed: {
            $failedDot = draw.dot(twoProng.pos.p, 1 * scaleFactor, 'black ' + visibleClass);
            return;
        }
        case debug_1.ElemType_TwoProng.deleted: {
            color = 'gray ';
            thin = '2';
            break;
        }
        case debug_1.ElemType_TwoProng.notAdded: {
            color = 'brown ';
            thin = '10';
            break;
        }
        case debug_1.ElemType_TwoProng.holeClosing: {
            color = 'cyan ';
            thin = '10';
            break;
        }
        case debug_1.ElemType_TwoProng.standard: {
            color = 'red ';
            thin = '2';
            break;
        }
    }
    if (twoProng.failed) {
        $failedDot = draw.dot(twoProng.pos.p, 1 * scaleFactor, 'black ' + visibleClass);
    }
    else if (!twoProng.failed) {
        $center = draw.dot(twoProng.circle.center, 0.05 * scaleFactor, 'yellow ' + visibleClass);
        $circle = draw.circle(twoProng.circle, color + 'thin' + thin + ' nofill ' + visibleClass);
        $cp1 = draw.dot(twoProng.pos.p, 0.055 * scaleFactor, color + visibleClass);
        $cp2 = draw.dot(twoProng.z, 0.07 * scaleFactor, color + visibleClass);
    }
    return { $failedDot, $center, $circle, $cp1, $cp2 };
}
exports.draw2Prong = draw2Prong;
