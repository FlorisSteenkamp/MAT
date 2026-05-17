import { expect, test } from '@jest/globals';
import { mats_obj1, getMats_calc1 } from './mat-dummys.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';


test('CpNodeFs -> getAllOnCircle', function() {
    // const mats_calc1 = getMats_calc1();

    // too hard for Jest due to circular references
    // expect(mats_obj1).toEqual(mats_calc1);
    
    // const { cpNode } = mats_calc1[0];
    const { cpNode } = mats_obj1[0];

    const cpNode_ = cpNode.nextOnCircle;

    expect(cpNode === cpNode_.nextOnCircle).toBe(true);

    expect(cpNode_.cp.pointOnShape.p).toEqual([24,8]);
    expect(cpNode_.cp.pointOnShape.t).toEqual(1);
    expect(cpNode_.cp.pointOnShape.isSource).toEqual(true);
    expect(cpNode_.cp.circle).toEqual({ center: [ 24, 8 ], radius: 0 });

    // Real test starts here...

    {
        // a two-prong `CpNode`
        const cpNodes = getAllOnCircle(cpNode);
        expect(cpNodes.length).toBe(2);
        expect(cpNodes[0] === cpNode).toBe(true);
        expect(cpNodes[1] === cpNode_).toBe(true);

        const cpNodesExcl = getAllOnCircle(cpNode, true);
        expect(cpNodesExcl.length).toBe(1);
        expect(cpNodesExcl[0] === cpNode_).toBe(true);

        const cpNodes_ = getAllOnCircle(cpNode_);
        expect(cpNodes_[0] === cpNodes[1]).toBe(true);
        expect(cpNodes_[1] === cpNodes[1]).toBe(false);
        expect(cpNodes_[1] === cpNodes[0]).toBe(true);

        const cpNodesExcl_ = getAllOnCircle(cpNode_, true);
        expect(cpNodesExcl_.length).toBe(1);
        expect(cpNodesExcl_[0] === cpNode).toBe(true);
    }

    // a three-prong `CpNode`
    {
        const allCpNodes = getAllOnLoop(cpNode);
        const cpNode3 = allCpNodes.find(cpn => getAllOnCircle(cpn).length === 3)!;

        const cpNodes = getAllOnCircle(cpNode3);
        expect(cpNodes.length).toBe(3);
        expect(cpNodes[0] === cpNodes[0].nextOnCircle.nextOnCircle.nextOnCircle).toBe(true);
        expect(cpNodes[1] === cpNodes[1].nextOnCircle.nextOnCircle.nextOnCircle).toBe(true);
        expect(cpNodes[2] === cpNodes[2].nextOnCircle.nextOnCircle.nextOnCircle).toBe(true);

        const cpNodesExcl = getAllOnCircle(cpNode3, true);
        expect(cpNodesExcl.length).toBe(2);
        expect(cpNodesExcl.includes(cpNode3)).toBe(false);
        expect(cpNodesExcl[0] === cpNode3.nextOnCircle).toBe(true);
        expect(cpNodesExcl[1] === cpNode3.nextOnCircle.nextOnCircle).toBe(true);

        expect(cpNodes[0] === cpNodes[0].nextOnCircle.nextOnCircle).toBe(false);
        expect(cpNodes[0] === cpNodes[0].nextOnCircle).toBe(false);
    }

    // a one-prong `CpNode` (has two `CpNode`s on its circle at the **same** point)
    {
        const allCpNodes = getAllOnLoop(cpNode);
        const cpNode1 = allCpNodes.find(cpn => {
            const allOnCircle = getAllOnCircle(cpn);
            return (
                allOnCircle.length === 2 && isTerminating(cpn)
            );
        })!;

        const cpNodes = getAllOnCircle(cpNode1);
        expect(cpNodes.length).toBe(2);
        expect(cpNodes[0].cp.pointOnShape.p).toEqual([24,8]);
        expect(cpNodes[1].cp.pointOnShape.p).toEqual([24,8]);

        const cpNodesExcl = getAllOnCircle(cpNode1, true);
        expect(cpNodesExcl.length).toBe(1);
        expect(cpNodesExcl[0] === cpNode1).toBe(false);
        expect(cpNodesExcl[0].cp.pointOnShape.p).toEqual([24,8]);

        expect(cpNodes[0].cp.circle.radius).toBe(0);
    }
});
