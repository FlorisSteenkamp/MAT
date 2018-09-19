"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a deep copy (clone) of the given Vertex. Since a Vertex represents an
 * entire MAT we have to clone an entire MAT.
 * @param vertex The Vertex to clone.
 */
function clone() {
    //f: (cp: ListNode, isLeaf: boolean) => void
    /*
        let newCps = vertex.cps;
        newCps[0].item
    
        let v = new Vertex(vertex.circle, undefined);
       
    
        let cps = vertex.cps.slice();
    
        while (cps.length) {
            let cp = cps.pop();
    
            while (!cp.isTerminating()) {
                f(cp, false);
    
                cp = cp.next;
    
                if (cp.isThreeProng()) {
                    cps.push(cp.nextOnCircle);
                }
            }
    
            if (inclLeaves) {
                f(cp, true);
            }
        }
        */
}
exports.clone = clone;
function clone_(_cp_) {
    /*
    let cp = _cp_.cp;
    let vertex = cp.vertex;

    let newVertex = new Vertex(
        vertex.circle,
        undefined //vertex.cps
    );
    let newCp = new ContactPoint(
        cp.pointOnShape,
        newVertex,
        cp.order,
        cp.order2
    );

    vertex.cps.push(newCp)
    */
}
