import { MatCircle } from '../classes/mat-circle';
/**
 * Marks the given branch as already taken.
 */
declare function markBranchAsTaken(visitedNodeMap: Map<MatCircle, Set<MatCircle>>, matCircle1: MatCircle, matCircle2: MatCircle): void;
declare function hasBranchBeenTaken(branchMap: Map<MatCircle, Set<MatCircle>>, matCircle1: MatCircle, matCircle2: MatCircle): boolean;
export { markBranchAsTaken, hasBranchBeenTaken };
