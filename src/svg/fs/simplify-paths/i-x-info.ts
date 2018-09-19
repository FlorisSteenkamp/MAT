
import { Curve } from '../../../curve';
import { Loop } from '../../../loop';

import { ILoopTree } from './i-loop-tree';

interface IXInfo {
    loop: Loop,
    pos: { curve: Curve, t: number },
    opposite: IXInfo;
    loopTree: ILoopTree;
}


export { IXInfo }
