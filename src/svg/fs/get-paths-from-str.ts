
import { getBeziersFromRawPaths } from './get-beziers-from-raw-paths';
import { Loop } from '../../loop';
import { parsePathDataString } from '../path-data-polyfill/parse-path-data-string';
import { beziersToSvgPathStr } from './beziers-to-svg-path-str';


function getPathsFromStr(str: string) {
    let bezierLoops = getBeziersFromRawPaths(
        parsePathDataString(str)
    );
    
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

    return bezierLoops.map( path => new Loop(path) );
}


export { getPathsFromStr }
