import { MatNode } from '../../classes/mat-node';
import { TMatCircleInclPrior } from './t-mat-circle-incl-prior';
/**
 * Modifies cullNodes by adding nodes that potentially need to be called.
 * Returns true if a node should NOT be culled, false otherwise.
 */
declare function cullIt(cullHash: {
    [index: string]: MatNode;
}, cullNodes: TMatCircleInclPrior[], satNode: MatNode, priorNode?: MatNode): boolean;
export { cullIt };
