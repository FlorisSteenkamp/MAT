
import { Loop } from '../../loop/loop';

import { getPathsFromStr } from '../../get-paths-from-str';


function getPathsFromSvgPathElem(elem: SVGPathElement) {
    return getPathsFromStr(elem.getAttribute("d"));
}


export { getPathsFromSvgPathElem }
