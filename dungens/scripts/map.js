const gridSize = 20;

class MapDungeon {
    constructor() {

        this.minRooms = 10;
        this.minSize = gridSize * 2;
        this.root = new Cell(0, 0, width, height);
        this.cells = [];

    }



    divide() {
        let rooms = 0;
        while (rooms < this.minRooms) {
            if (this.root.divide(this.minSize)) {
                rooms++;
            }
        }
    }

    shrink() {
        this.root.shrink(this.minSize);
    }

    snap() {
        for (const c of this.cells) {
            c.x = snapToGrid(c.x);
            c.y = snapToGrid(c.y);
            c.x2 = snapToGrid(c.x2);
            c.y2 = snapToGrid(c.y2);

            for (const h of c.hHalls) {
                h.x = snapToGrid(h.x);
                h.y = snapToGrid(h.y);
                h.x2 = snapToGrid(h.x2);
                h.y2 = snapToGrid(h.y2);
            }
            for (const h of c.vHalls) {
                h.x = snapToGrid(h.x);
                h.y = snapToGrid(h.y);
                h.x2 = snapToGrid(h.x2);
                h.y2 = snapToGrid(h.y2);
            }
        }
    }

    addHalls() {
        for (const c1 of this.cells) {
            for (const c2 of c1.hNeighbours) {
                if (Math.min(c1.y2, c2.y2) - Math.max(c1.y, c2.y) > gridSize) {
                    const upperY = Math.max(c1.y, c2.y);
                    const lowerY = Math.min(c1.y2, c2.y2) - gridSize;
                    const hallY = Math.floor(Math.random() * (lowerY - upperY) + upperY);
                    const hallX = c1.x2;
                    const hallX2 = c2.x;
                    const hallY2 = hallY + gridSize;
                    const hall = new Hall(hallX, hallY, hallX2, hallY2);
                    c1.hHalls.push(hall);
                }

            }
            for (const c2 of c1.vNeighbours) {

                if (Math.min(c1.x2, c2.x2) - Math.max(c1.x, c2.x) > gridSize) {
                    const leftX = Math.max(c1.x, c2.x);
                    const rightX = Math.min(c1.x2, c2.x2) - gridSize;
                    const hallX = Math.floor(Math.random() * (rightX - leftX) + leftX);
                    const hallY = c1.y2;
                    const hallY2 = c2.y;
                    const hallX2 = hallX + gridSize;
                    const hall = new Hall(hallX, hallY, hallX2, hallY2);
                    c1.vHalls.push(hall);
                }
            }
        }
    }


    getNeighbours() {
        this.root.getLeaves(this.cells);

        for (const c1 of this.cells) {
            for (const c2 of this.cells) {
                if (c1 === c2) continue;
                if (c1.x2 === c2.x) {
                    console.log('found neighbour');
                    console.log(c1, c2)
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


    draw(ctx) {
        this.root.draw(ctx);
    }
}


function snapToGrid(value) {
    return Math.floor(value / gridSize) * gridSize;
}