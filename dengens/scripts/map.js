
const gridSize = 20;

class MapDengen {
    constructor() {
        this.root = new Cell(30, 30, width - 30, height - 30);
        this.numRooms = 20;
        this.minCellDim = 2 * gridSize;
        /**
         * @type {Cell[]}
         */
        this.cells = [];
    }

    divide() {
        let rooms = 1;
        while (rooms < this.numRooms) {
            if (this.root.divide(this.minCellDim)) {
                rooms++;
            }
        }
    }

    shrink() {
        this.root.shrink(this.minCellDim);
    }

    snap() {
        for (const c of this.cells) {
            c.x = snapToGrid(c.x);
            c.y = snapToGrid(c.y);
            c.x2 = snapToGrid(c.x2);
            c.y2 = snapToGrid(c.y2);

            for (const h of c.hHall) {
                h.x1 = snapToGrid(h.x1);
                h.y1 = snapToGrid(h.y1);
                h.x2 = snapToGrid(h.x2);
                h.y2 = snapToGrid(h.y2);
            }
            for (const h of c.vHall) {
                h.x1 = snapToGrid(h.x1);
                h.y1 = snapToGrid(h.y1);
                h.x2 = snapToGrid(h.x2);
                h.y2 = snapToGrid(h.y2);
            }
        }
    }
    addHalls() {
        for (const c1 of this.cells) {
            for (const n of c1.hNeighbours) {
                if (Math.min(c1.y2, n.y2) - Math.max(c1.y, n.y) > gridSize) {
                    // 1. Define your boundaries
                    const lowerBound = Math.max(c1.y, n.y);
                    const upperBound = Math.min(c1.y2, n.y2) - gridSize;

                    // 2. Apply the JS random range formula: Math.random() * (max - min) + min
                    const y = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);

                    c1.hHall.push(new Hall(c1.x2, y, n.x, y + gridSize));

                }
            }
            for (const n of c1.vNeighbours) {
                if (Math.min(c1.x2, n.x2) - Math.max(c1.x, n.x) > gridSize) {
                    // 1. Define your boundaries
                    const lowerBound = Math.max(c1.x, n.x);
                    const upperBound = Math.min(c1.x2, n.x2) - gridSize;

                    // 2. Apply the JS random range formula: Math.random() * (max - min) + min
                    const x = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);

                    c1.vHall.push(new Hall(x, c1.y2, x + gridSize, n.y));

                }
            }
        }

    }


    getNeighbours() {
        this.root.getLeaves(this.cells);

        for (const c1 of this.cells) {
            for (const c2 of this.cells) {
                if (c1 !== c2) {
                    if (c1.x2 === c2.x) {
                        if (Math.max(c1.y, c2.y) < Math.min(c1.y2, c2.y2)) {
                            c1.hNeighbours.push(c2);
                        }
                    }

                    if (c1.y2 === c2.y) {
                        if (Math.max(c1.x, c2.x) < Math.min(c1.x2, c2.x2)) {
                            c1.vNeighbours.push(c2);
                        }
                    }
                }
            }
        }
    }
    display(ctx) {
        this.root.display(ctx);
    }
}



function snapToGrid(x) {
    return Math.round(x / gridSize) * gridSize;
}