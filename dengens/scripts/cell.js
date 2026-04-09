
class Cell {
    constructor(x, y, x2, y2) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.left = null;
        this.right = null;

        /**@type {Cell[]} */
        this.hNeighbours = []
        /**@type {Cell[]} */
        this.vNeighbours = [];

        /**@type {Hall[]} */
        this.hHall = [];

        /**@type {Hall[]} */
        this.vHall = []
    }

    getLeaves(cells) {
        if (this.left == null) {
            cells.push(this);
        } else {
            this.left.getLeaves(cells);
            this.right.getLeaves(cells);
        }
    }
    shrink(mCD) {
        if (this.left == null) {
            const width = this.x2 - this.x;
            const height = this.y2 - this.y;
            const newW = Math.max(width * (Math.random() * 0.45 + 0.45), mCD);
            const newH = Math.max(height * (Math.random() * 0.45 + 0.45), mCD);

            this.x = Math.floor(this.x + (0.5 * (width - newW)));
            this.x2 = Math.floor(this.x2 - (0.5 * (width - newW)));

            this.y = Math.floor(this.y + (0.5 * (height - newH)));
            this.y2 = Math.floor(this.y2 - (0.5 * (height - newH)));
        } else {
            this.left.shrink(mCD);
            this.right.shrink(mCD);
        }
    }



    divide(minDim) {
        const width = this.x2 - this.x;
        const height = this.y2 - this.y;

        if (width < minDim && height < minDim) { return false; }
        if (this.left !== null) {
            if (Math.random() < 0.5) {
                return this.left.divide(minDim);
            } else {
                return this.right.divide(minDim);
            }
        }
        if (width > height) {
            const newMid = this.x + Math.floor((Math.random() * 0.3 + 0.3) * width);
            this.left = new Cell(this.x, this.y, newMid, this.y2);
            this.right = new Cell(newMid, this.y, this.x2, this.y2);
        } else {
            const newMid = this.y + Math.floor((Math.random() * 0.3 + 0.3) * height);
            this.left = new Cell(this.x, this.y, this.x2, newMid);
            this.right = new Cell(this.x, newMid, this.x2, this.y2);
        }
        return true;
    }
    /** @param {CanvasRenderingContext2D} ctx */
    display(ctx) {
        if (this.left) {
            this.left.display(ctx);
            this.right.display(ctx);
        } else {
            // ctx.strokeStyle = 'white';
            for (const h of this.hHall) {
                h.display(ctx);
            }
            for (const v of this.vHall) {
                v.display(ctx);
            }
            ctx.lineWidth = 3
            const w = this.x2 - this.x;
            const h = this.y2 - this.y;
            ctx.strokeRect(this.x, this.y, w, h);
        }
    }
}