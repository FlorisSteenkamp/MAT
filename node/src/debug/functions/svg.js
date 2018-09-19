"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
function showOrHideElems() {
    let toDraw = _debug_.config.toDraw;
    
    for (let key in ElemType) {
        showOrHide_GENERAL(
            ElemType[key as ElemType],
            toDraw[key as ElemType]
        );
    }
}
*/
/**
 * Show or hide SVG Mat elements of any type according to the current debug
 * config.
 *
 * This function works for general elements but does not perform full compile
 * time type checking.
 */
/*
function showOrHide_GENERAL(
            elemType: ElemType,
            toDraw: { [index: string]: boolean } ) {

    let elems = _debug_.generated.elems[elemType];
    
    for (let elem of elems) {
        showOrHide(
            elem.$svg,
            toDraw[ (_debug_.fs.elemType[elemType] as Function)(elem.data) ]
        );
    }
}


function showOrHide(
        $svgs: { [index: string]: any }, show: boolean): void {

    for (let key in $svgs) {
        let $svg = $svgs[key];

        showOrHideSvgElem($svg, show);
    }
}


function showOrHideSvgElem($svg: any, show: boolean): void {
    if (!$svg) { return; }
    
    if (show) {
        $svg.removeClass('invisible');
    } else {
        if (!$svg.hasClass('invisible')) {
            $svg.addClass('invisible');
        }
    }
}


function deleteAllSvgs() {
    for (let key in ElemType) {
        deleteElemsSvgs(key as ElemType);
    }
}


function deleteElemsSvgs(key: ElemType) {
    let svg = _debug_.generated.elems;
    let elemType = ElemType[key];
    let elems = svg[elemType];

    for (let elem of elems) {
        let $svgs = elem.$svg;
        if (!$svgs) { continue; }

        deleteElemSvgs($svgs)
    }
}
*/
/**
 * Delete all SVG elements of a specific element.
 * @param $svgs
 */
/*
function deleteElemSvgs($svgs: { [index: string]: any }) {
    for (let key in $svgs) {
        if (!$svgs[key]) { continue; }
        $svgs[key].remove();
        delete $svgs[key];
    }
}
*/
/**
 *  SVG debug functions.
 */
let svgDebugFunctions = {};
exports.svgDebugFunctions = svgDebugFunctions;
