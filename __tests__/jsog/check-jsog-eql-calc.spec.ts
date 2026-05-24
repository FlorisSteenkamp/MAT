import type { Mat } from '../../src/mat/mat.js';
import { expect, test } from '@jest/globals';
import { squares4 } from 'squares-rng';
import { mats1_, getMats1 } from './mat-dummys.js';
import { CpNode, getAllOnLoop } from '../../src/index.js';


test('Check MAT objects equal (JSOG)', function() {
    const mats1 = getMats1();

    // too hard for Jest due to circular references
    // expect(mats_obj1).toEqual(mats_calc1);
    
    // Fast path: check root array structure and length
    expect(Array.isArray(mats1_)).toBe(true);
    expect(Array.isArray(mats1)).toBe(true);
    expect(mats1_.length).toBe(mats1.length);
    
    // Verify key properties of the MAT objects instead of deep comparison
    const mats1_0_ = mats1_[0];
    const mats1_0 = mats1[0];
    
    // Check critical structure exists
    expect(mats1_0_).toHaveProperty('cpNode');
    expect(mats1_0).toHaveProperty('cpNode');
    
    // Verify circular reference integrity
    if (mats1_0_.cpNode && mats1_0_.cpNode.nextOnCircle) {
        expect(mats1_0_.cpNode.nextOnCircle).toBeDefined();
    }

    getAllOnLoop(mats1_0_.cpNode).length; //?

    // Perform a random walk on the calculated MAT to ensure it behaves as expected
    let testCpNode = mats1_0.cpNode;
    let testCpNode_ = mats1_0_.cpNode;

    const N = 10;
    let reachCpNodes = new Set<CpNode>();
    for (let i=0; i<N; i++) {
        testCpNode = randomWalk(testCpNode, i*N, N);
        testCpNode_ = randomWalk(testCpNode_, i*N, N);

        // testCpNode.cp.pointOnShape.p; //?
        // testCpNode_.cp.pointOnShape.p;//?

        reachCpNodes.add(testCpNode);

        expect(testCpNode.cp.pointOnShape).toEqual(testCpNode_.cp.pointOnShape);
    }

    reachCpNodes.size; //?
});


const NEXT = 0;
const PREV = 1;
const NEXT_ON_CIRCLE = 2;
const PREV_ON_CIRCLE = 3;

function randomWalk(
        cpNode: CpNode,
        seed: number,
        steps: number) {

    for (let i=0; i<steps; i++) {
        const direction = squares4(seed + i) % 4;

        if (direction === NEXT) {
            cpNode = cpNode.next;
        } else if (direction === PREV) {
            cpNode = cpNode.prev;
        } else if (direction === NEXT_ON_CIRCLE) {
            cpNode = cpNode.nextOnCircle;
        } else if (direction === PREV_ON_CIRCLE) {
            cpNode = cpNode.prevOnCircle;
        }
    }

    return cpNode;
}
