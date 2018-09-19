
const EVENT_LEFT  = 0;
const EVENT_RIGHT = 1;


/**
 * Find and return axis-aligned open boxes that intersect via a sweepline 
 * algorithm. 
 */ 
function findBbIntersections(boxes: number[][][]) {

	// Initialize event queue to equal all box x-axis endpoints.
	let events = [];
	for (let i=0; i<boxes.length; i++) {
        let box = boxes[i];
        let smallerSide = box[0][0] < box[1][0] ? 0 : 1;
        let largerSide = smallerSide === 0 ? 1 : 0;
		events.push(new Event(0, box, box[smallerSide]));
		events.push(new Event(1, box, box[largerSide]));
	}

	events.sort(Event.compare);
	
	let activeBoxes = new Set<number[][]>();
	
	let intersections = [];
	for (let i=0; i<events.length; i++) {
		let event = events[i];
		
    	let box = event.box;
    	
   		if (event.type === EVENT_LEFT) {
   			
   			for (let activeBox of activeBoxes.values()) {
   				if (areBoxesIntersecting(box, activeBox)) { 
                    intersections.push({
                        box1: box, box2: 
                        activeBox
                    });
   				}
   			}

   			activeBoxes.add(box);
   		} else if (event.type === EVENT_RIGHT) {
   			activeBoxes.delete(event.box);
   		}
	}
	
	return intersections;
}


class Event {

    /**
     * Event class constructor
     * @param type - 0 -> left side, 1 -> right side
     * @param box - An axis-aligned 2-box described by 2 points
     * @param p - A point.
     */
    constructor(
            public type: number, 
            public box: number[][], 
            public p: number[]) {
    }


    /**
     * Compare two Events by their x-axis and then by their type. Since it is
     * open boxes that are compare we must let the right endpoint type come
     * before the left.
     * @param a A point (within an object)
     * @param b A point (within an object)
     */
    static compare(a: Event, b: Event) {
        let res = a.p[0] - b.p[0];

        if (res !== 0) { return res; }

        if (a.box === b.box) { 
            return a.type === EVENT_RIGHT ? -1 : +1;
        }

        return a.type === EVENT_LEFT ? +1 : -1;
    }
}


/**
 * Returns true if the 2 given (open) boxes intersect. At this stage we already
 * know their x-axis intersect.
 */
function areBoxesIntersecting(
            a: number[][], 
            b: number[][]) {

    let [[,a0],[,a1]] = a;
    let [[,b0],[,b1]] = b;
    
    if (a0 > a1) { [a0,a1] = [a1,a0] };
    if (b0 > b1) { [b0,b1] = [b1,b0] };

    if (a0 === b0) { 
        if (a0 === a1 || b0 === b1) {
            return false;
        }
        return true; 
    }

    if (a0 < b0) { 
        if (a1 <= b0) { return false; }
        return true;
    }
    if (a0 > b0) { 
        if (b1 <= a0) { return false; }
        return true;
    }
}


export default findBbIntersections;
