
/**
 * see [Wikipedia](https://en.wikipedia.org/wiki/Heap_(data_structure))
 * 
 * @internal
 */
class Heap<T> {
    public heap: T[] = [];

    constructor(private compare: (a: T, b: T) => number) {}

    public isEmpty() {
        return this.heap.length === 0;
    }

    public insert(t: T): void {
        const heap = this.heap;

        heap.push(t);

        // Swim up
        let i = heap.length-1;
        while (true) {
            const parentIdx = (i - 1 - (i+1)%2)/2;
            if (parentIdx === -1) { return; }

            const parent = heap[parentIdx];
            if (this.compare(t, parent) < 0) { 
                break;
            }
            
            // Swap and update indexes and variables
            heap[parentIdx] = t;
            heap[i] = parent;
            i = parentIdx;
        }
    }


    public popMax(): T {
        const heap = this.heap;
        const maxT = heap[0];
        heap[0] = heap[heap.length - 1];
        heap.length--;
        this.swimDown();

        return maxT;
    }


    private swimDown() {
        const heap = this.heap;

        const len = heap.length;
    
        let i = 0;
        // Swim down
        while (true) {
            const leftIdx = 2*i + 1;
            if (leftIdx >= len) { 
                break;  // there's no left or right child
            }
            const rightIdx = 2*i + 2;

            const swapIdx = (rightIdx >= len) || (this.compare(heap[leftIdx], heap[rightIdx]) > 0)
                ? leftIdx
                : rightIdx;

            const swapChild = heap[swapIdx];

            const parent = heap[i];    
            if (this.compare(parent, swapChild) > 0) { 
                break;
            }

            // Swap and update indexes
            heap[swapIdx] = parent;
            heap[i] = swapChild;
            i = swapIdx;
        }
    }


    public swapMinOrMax(t: T): void {
        this.heap[0] = t;
        this.swimDown();
    }

    /* ignore coverage */
    public static getParentIdx(i: number) { return (i - 1 - (i+1)%2)/2; }
    public static getLeftChild(i: number) { return 2*i + 1; }
    public static getRightChild(i: number) { return 2*i + 2; }
}


export { Heap }
