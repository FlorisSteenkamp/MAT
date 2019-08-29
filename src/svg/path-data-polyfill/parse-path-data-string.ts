
import { Source } from './source';


/**
 * @hidden
 * @param string 
 */
function parsePathDataString(string: string) {
    if (!string.length) return [];

    let source = new Source(string);
    let pathData = [];

    if (!source.initialCommandIsMoveTo()) { return []; }

    while (source.hasMoreData()) {
        let pathSeg = source.parseSegment();

        if (pathSeg === null) {
            break;
        } else {
            pathData.push(pathSeg);
        }
    }

    return pathData;
}


export { parsePathDataString }
