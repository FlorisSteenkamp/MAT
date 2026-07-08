import type { Loop } from "flo-boolean";
import type { LoopStringifyable } from "./loop-stringifyable";


function loopToStringifyable(
        loop: Loop): LoopStringifyable {

    const { idx, beziers } = loop;

    return { idx: idx!, beziers };
}


export { loopToStringifyable }
