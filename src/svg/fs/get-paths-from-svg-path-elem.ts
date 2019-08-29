
import { getPathsFromStr } from '../../get-paths-from-str';


/** @hidden */
function getPathsFromSvgPathElem(elem: SVGPathElement) {
    return getPathsFromStr(elem.getAttribute("d"));
}


export { getPathsFromSvgPathElem }
