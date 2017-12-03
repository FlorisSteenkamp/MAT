
import MatCircle from './mat-circle';


/**
 * Representation of a node in the MAT structure.
 * @param matCircle
 * @param branches
 */
class MatNode {
    matCircle: MatCircle;
    branches: MatNode[];

    constructor(matCircle: MatCircle, branches: MatNode[]) {
	    this.matCircle = matCircle;
        this.branches  = branches;		
    }


    public static copy(node: MatNode) {
        
        return f(node);
        
        function f(
                matNode: MatNode, 
                priorNode?: MatNode, 
                newPriorNode?: MatNode) {
            
            let branches: MatNode[] = [];
            let newNode = new MatNode(matNode.matCircle, branches);
            
            for (let node of matNode.branches) {
                if (node === priorNode) {
                    // Don't go back in tracks.
                    branches.push(newPriorNode);
                    continue;
                }
                
                branches.push(f(node, matNode, newNode));
            }
            
            return newNode;
        }
    }
} 


export default MatNode;
