import { Loop } from "flo-boolean";


function compareLoopsByValue(
        loop1: Loop,
        loop2: Loop): boolean {

    const { idx: idx1, beziers: beziers1, curves: curves1 } = loop1;
    const { idx: idx2, beziers: beziers2, curves: curves2 } = loop2;

    if (idx1 !== idx2) { return false; }
    if (beziers1.length !== beziers2.length) { return false; }
    for (let i=0; i<beziers1.length; i++) {
        const b1 = beziers1[i];
        const b2 = beziers2[i];
        if (b1.length !== b2.length) { return false; }
        for (let j=0; j<b1.length; j++) {
            const p1 = b1[j];
            const p2 = b2[j];
            if (p1[0] !== p2[0] || p1[1] !== p2[1]) { return false; }
        }
    }

    for (let i=0; i<curves1.length; i++) {
        const c1 = curves1[i];
        const c2 = curves2[i];
        
        if (c1.idx !== c2.idx) { return false; }
        if (!c1.next || !c2.next || !c1.prev || !c2.prev ||
            !c1.ps || !c2.ps) {
                
            return false;
        }
    }

    return true;
}


export { compareLoopsByValue }
