const scale = 8;
const gridSize = 20 * scale;
const hallWidth = 40 * scale

class DungenMap {
    constructor() {
        this.root = new Cell(0, 0, width * scale, height * scale);
        this.minRooms = 50;
        this.minDimensions = 2 * gridSize;
        /**
         * @type {Cell[]}
         */
        this.cells = []
    }

    snap() {
        for (const c of this.cells) {
            c.roomX = snapToGrid(c.roomX);
            c.roomY = snapToGrid(c.roomY);
            c.roomX2 = snapToGrid(c.roomX2);
            c.roomY2 = snapToGrid(c.roomY2);

            for (const h of c.hHall) {
                h.x = snapToGrid(h.x);
                h.y = snapToGrid(h.y);
                h.x2 = snapToGrid(h.x2);
                h.y2 = snapToGrid(h.y2);
            }
            for (const h of c.vHall) {
                h.x = snapToGrid(h.x);
                h.y = snapToGrid(h.y);
                h.x2 = snapToGrid(h.x2);
                h.y2 = snapToGrid(h.y2);
            }
        }
    }
    getNeighbours() {
        this.root.getLeaves(this.cells);


        for (const c1 of this.cells) {
            for (const c2 of this.cells) {
                if (c1 === c2) continue;
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

    addHalls() {
        for (const c of this.cells) {
            for (const n of c.hNeighbours) {
                if (Math.min(c.roomY2, n.roomY2) - Math.max(c.roomY, n.roomY) > hallWidth) {
                    const upperY = Math.max(c.roomY, n.roomY);
                    const lowerY = Math.min(c.roomY2, n.roomY2) - hallWidth;
                    const diff = lowerY - upperY;

                    const hallY = Math.floor(Math.random() * (diff) + upperY);
                    const hall = new Hall(c.roomX2, hallY, n.roomX, hallY + hallWidth);

                    c.hHall.push(hall);

                }
            }
            for (const n of c.vNeighbours) {
                if (Math.min(c.roomX2, n.roomX2) - Math.max(c.roomX, n.roomX) > hallWidth) {
                    const upperY = Math.max(c.roomX, n.roomX);
                    const lowerY = Math.min(c.roomX2, n.roomX2) - hallWidth;
                    const diff = lowerY - upperY;

                    const hallX = Math.floor(Math.random() * (diff) + upperY);
                    const hall = new Hall(hallX, c.roomY2, hallX + hallWidth, n.roomY);

                    c.vHall.push(hall);

                }
            }
        }
    }
    divide() {
        let rooms = 0;
        while (rooms < this.minRooms) {
            if (this.root.divide(this.minDimensions)) {
                rooms++;
            }
        }
    }

    shrink() {
        this.root.shrink(this.minDimensions);
    }

    update(pos) {
        for (const c of this.cells) {
            c.roomX += pos.x;
            c.roomX2 += pos.x;
            c.roomY += pos.y;
            c.roomY2 += pos.y;

            for (const h of c.hHall) {
                h.x += pos.x;
                h.y += pos.y;
                h.x2 += pos.x;
                h.y2 += pos.y;
            }

            for (const h of c.vHall) {
                h.x += pos.x;
                h.y += pos.y;
                h.x2 += pos.x;
                h.y2 += pos.y;
            }
        }
    }


    draw(ctx) {
        this.root.draw(ctx);
    }
}



function snapToGrid(value) {
    return Math.floor(value / gridSize) * gridSize;
}