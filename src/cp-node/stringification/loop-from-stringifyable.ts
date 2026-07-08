import type { Loop } from "flo-boolean";
import type { LoopStringifyable } from "./loop-stringifyable";
import { loopFromBeziers } from "flo-boolean";


function loopFromStringifyable(
        loopStringifyable: LoopStringifyable): Loop {

    const { idx, beziers } = loopStringifyable;

    return loopFromBeziers(beziers, idx);
}


export { loopFromStringifyable }
