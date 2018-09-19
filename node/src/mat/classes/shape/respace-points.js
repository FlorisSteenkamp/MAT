"use strict";
/*
     * TODO - uncomment and finish implementation
     * Respace points so that the total absolute curvature between
     * consecutive points are very roughly equal.
     *
     * @param contactPointsPerLoop
     * @param maxAbsCurvatureInDegrees
     *
     * NOTES: Mutates contactPoints.
     */
/*
private static respacePoints(
        contactPointsPerLoop: LinkedLoop<ContactPoint>[],
        maxAbsCurvatureInDegrees: number) {
    
    for (let k=0; k<contactPointsPerLoop.length; k++) {
        let contactPoints = contactPointsPerLoop[k];
        
        let cpNode = contactPoints.head;
        let recheck;
        do {
            recheck = false;
            
            let totalCurvatures = [];
            let denseCpNode = cpNode.coupledNode;
            
            do {
                let c = getTotalAbsCurvatureBetweenCps(
                        [denseCpNode.item, denseCpNode.next.item]
                );
                
                totalCurvatures.push({cpNode: denseCpNode, c});
                
                denseCpNode = denseCpNode.next;
            } while (denseCpNode.coupledNode !== cpNode.next);

            let totalCurvature = sumCurvatures(totalCurvatures);
            
            cpNode.totalCurvatures = totalCurvatures;
            cpNode.totalCurvature  = totalCurvature;
            
            
            let totalInDegrees = totalCurvature * 180 / Math.PI;
            // if (totalInDegrees > 180 || totalInDegrees < 5) { console.log(totalInDegrees); }
            if (totalInDegrees > maxAbsCurvatureInDegrees) {
                // Add a point
                //console.log(totalCurvatures);
                
                let accumTot = 0;
                let tc = cpNode.totalCurvature; // cache
                let bestIndx = undefined;
                let leftDenseIndx = 0;
                let rightDenseIndx;
                let accumTotAtLeft  = 0;
                let accumTotAtRight = undefined;
                let bestDiff = Number.POSITIVE_INFINITY;
                for (let i=0; i<totalCurvatures.length; i++) {
                    
                    let c = totalCurvatures[i].c;
                    let cTot = c.totalCurvature + c.totalTurn;
                    accumTot += cTot;
                    
                    let cpn = totalCurvatures[i].cpNode;
                    if (accumTot <= tc/2) {
                        leftDenseIndx = i;
                        accumTotAtLeft = accumTot;
                    }

                    if (!rightDenseIndx && accumTot > tc/2) {
                        // This may be out of bounds but really means cpNode.next
                        rightDenseIndx = i;
                        accumTotAtRight = accumTot;
                    }
                
                    let absDiff = Math.abs(tc/2 - accumTot);
                    // TODO - We can also add a weight for point values here
                    // such that for instance inverse curvature points
                    // carry more weight than dull corners, etc.
                    // TODO Make the 1/4 or 1/3 below a constant that can
                    // be set.
                    //if (accumTot > tc/3 && accumTot < 2*tc/3 &&
                    if (accumTot > tc/4 && accumTot < 3*tc/4 &&
                        bestDiff > absDiff) {
                        // If within middle 1/3 and better
                        
                        bestIndx = i;
                        bestDiff = absDiff;
                    }
                }

                
                // aaa console.log(leftDenseIndx, bestIndx, rightDenseIndx);
                
                if (bestIndx !== undefined) {
                    // Reify the point
                    let tcInfo = totalCurvatures[bestIndx];
                    
                    // Note that after the below insert cpNode.next will
                    // equal the newly inserted cpNode.
                    let newCpNode = LinkedLoop.insert(
                            contactPoints,
                            tcInfo.cpNode.next.item,
                            cpNode,
                            tcInfo.cpNode.next
                    );
                    tcInfo.cpNode.next.coupledNode = newCpNode;
                    
                    cpNode.totalCurvatures = cpNode.totalCurvatures.slice(
                            0, bestIndx+1
                    );
                    cpNode.totalCurvature = sumCurvatures(
                            cpNode.totalCurvatures
                    );
                    
                    recheck = true; // Start again from same contact point.
                } else {
                    // We could not find an 'interesting' point to use, so
                    // find some center point between the two contact
                    // points.
                    

                    let leftTcInfo  = totalCurvatures[leftDenseIndx];
                    let rightTcInfo = totalCurvatures[rightDenseIndx];
                    
                    let leftCpNode  = leftTcInfo. cpNode;
                    let rightCpNode = rightTcInfo.cpNode;
                    
                    let leftC = leftTcInfo.c;
                    
                    let leftCp = leftTcInfo.cpNode.next;
                    let rightCp = rightTcInfo.cpNode.next;
                    
                    //aaa console.log(accumTotAtLeft,	accumTotAtRight, tc/2);
                    
                    
                    let pos = getCPointBetweenCps(
                            leftCpNode.item, rightCpNode.item,
                            accumTotAtLeft,	accumTotAtRight,
                            tc/2
                    );

                    
                    /*
                    let newCp = new ContactPoint(pos, undefined);
                    let newCpNode = LinkedLoop.insert(
                            contactPoints,
                            newCp,
                            leftCpNode,
                            undefined
                    );
                    
                    let newDenseCpNode = LinkedLoop.insert(
                            denseContactPoints,
                            newCp,
                            cpNode,
                            undefined
                    );
                    
                    newCpNode.coupledNode = newDenseCpNode;
                    newDenseCpNode.coupledNode = newCpNode;
                    
                    
                    aaa
                    cpNode.totalCurvatures = cpNode.totalCurvatures.slice(
                            0, bestIndx
                    );
                    cpNode.totalCurvature = sumCurvatures(
                            cpNode.totalCurvatures
                    );
                    
                    recheck = true; // Start again from same contact point.
                    */ /*
}
} else if (totalInDegrees < 15) {
// Remove a point
//console.log(totalCurvatures);

}


if (!recheck) {
cpNode = cpNode.next;
}
} while (cpNode !== contactPoints.head);
}
}*/
/**
* TODO - uncomment and finish
* Calculates and returns total absolute curvature between
* the given contact points.
* @param {ContactPoint[]}
* @returns {Object}
*/
/*
function getTotalAbsCurvatureBetweenCps([cpStart, cpEnd]) {
    let posStart = cpStart.pointOnShape;
    let posEnd   = cpEnd.  pointOnShape;
    
    let bezierNodeStart = posStart.bezierNode;
    let bezierNodeEnd   = posEnd.  bezierNode;
    
    let bezierNode = bezierNodeStart;
    
    let totalTurn = 0;
    let totalCurvature = 0;
    do {
        let turn;
        if (bezierNode !== bezierNodeEnd) {
            turn = Math.abs(getCurvatureAtInterface(bezierNode));
        } else {
            turn = 0;
        }
        
        
        let curvature;
        let interval = [0,1];
        if (bezierNode === bezierNodeStart) { interval[0] = posStart.t; }
        if (bezierNode === bezierNodeEnd)   { interval[1] = posEnd.t; }
        curvature = Bezier3.getTotalAbsoluteCurvature(bezierNode.item.bezier3)(interval);

        
        totalTurn += turn;
        totalCurvature += curvature;
        
        bezierNode = bezierNode.next;
    } while (bezierNode.prev !== bezierNodeEnd);

    
    return { totalTurn, totalCurvature };
}
*/
/**
 * TODO - uncomment and finish
 * Finds a point on the shape between the given contact points which
 * is as close as possible to a point with accumalated abs curvature
 * (from accumAtLeft) equal to totAtMid.
 *
 * @param leftCp
 * @param rightCp
 * @param accumTotAtLeft
 * @param accumTotAtRight
 * @param totAtMid
 * @returns {PointOnShape}
 */
/*
function getCPointBetweenCps(
        leftCp: ContactPoint,
        rightCp: ContactPoint,
        accumTotAtLeft: number,
        accumTotAtRight: number,
        totAtMid: number) {
    
    let accumTo = totAtMid - accumTotAtLeft;
    
    let posStart = leftCp .pointOnShape;
    let posEnd   = rightCp.pointOnShape;
    
    let bezierNodeStart = posStart.bezierNode;
    let bezierNodeEnd   = posEnd.  bezierNode;
    
    let bezierNode = bezierNodeStart;
    
    let totalTurn = 0;
    let totalCurvature = 0;
    do {
        let turn;
        if (bezierNode !== bezierNodeEnd) {
            turn = Math.abs(getCurvatureAtInterface(bezierNode));
        } else {
            turn = 0;
        }
        
        
        let curvature;
        let interval = [0,1];
        if (bezierNode === bezierNodeStart) { interval[0] = posStart.t; }
        if (bezierNode === bezierNodeEnd)   { interval[1] = posEnd.t; }
        curvature = Bezier3.getTotalAbsoluteCurvature(bezierNode.item.bezier3)(interval);

        
        totalTurn += turn;
        totalCurvature += curvature;
        
        let totalBoth = totalTurn + totalCurvature;
        if (totalBoth >= accumTo) {
            // aaa console.log('accumTo: ' + accumTo, 'totalBoth: ' + totalBoth);
            break;
        }
        
        bezierNode = bezierNode.next;
    } while (bezierNode.prev !== bezierNodeEnd);

    
    //return { totalTurn, totalCurvature };
}
*/
/**
 * TODO - uncomment and finish
 */
/*
function sumCurvatures(curvatures: number[]): number {
    let total = 0;
    
    for (let i=0; i<curvatures.length; i++) {
        let c = curvatures[i].c;
        
        total += c.totalTurn + c.totalCurvature;
    }
    
    return total;
}
*/ 
