

class Cell {
    constructor(x, y, x2, y2) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.width = x2 - x;
        this.height = y2 - y;
        this.left = null;
        this.right = null;

        this.vNeighbours = []
        this.hNeighbours = [];

        this.vHalls = [];
        this.hHalls = [];
    }

    divide(minimumSize) {
        if (this.width < minimumSize && this.height < minimumSize) {
            return false;
        }


        if (this.left !== null) {
            if (Math.random() > 0.5) {
                return this.left.divide(minimumSize);
            } else {
                return this.right.divide(minimumSize);
            }
        }
        if (this.width > this.height) {
            const newMidX = this.x + Math.floor((Math.random() * 0.3 + 0.3) * this.width);
            this.left = new Cell(this.x, this.y, newMidX, this.y2);
            this.right = new Cell(newMidX, this.y, this.x2, this.y2);
        } else {
            const newMidY = this.y + Math.floor((Math.random() * 0.3 + 0.3) * this.height);
            this.left = new Cell(this.x, this.y, this.x2, newMidY);
            this.right = new Cell(this.x, newMidY, this.x2, this.y2)
        }
        return true;
    }

    shrink(minimumSize) {

        if (this.left !== null) {
            this.left.shrink(minimumSize);
            this.right.shrink(minimumSize)
        } else {
            const newWidth = Math.floor(Math.max(minimumSize, this.width * (Math.random() * 0.45 + 0.45)));
            const newHeight = Math.floor(Math.max(minimumSize, this.height * (Math.random() * 0.45 + 0.45)));
            this.x = this.x + (Math.floor(this.width - newWidth) * 0.5);
            this.x2 = this.x + newWidth;
            this.y = this.y + (Math.floor(this.height - newHeight) * 0.5);
            this.y2 = this.y + newHeight;

            this.width = newWidth;
            this.height = newHeight;
        }

    }

    getLeaves(cells) {
        if (this.left !== null) {
            this.left.getLeaves(cells);
            this.right.getLeaves(cells);
        } else {
            cells.push(this);
        }
    }
    draw(ctx) {
        if (this.left !== null) {
            this.left.draw(ctx);
            this.right.draw(ctx);
        } else {
            for (const h of this.hHalls) {
                h.draw(ctx);
            }
            for (const v of this.vHalls) {
                v.draw(ctx);
            }
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}