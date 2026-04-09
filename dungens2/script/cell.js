


class Cell {
    constructor(x, y, x2, y2) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.width = this.x2 - this.x;
        this.height = this.y2 - this.y;

        this.left = null;
        this.right = null;

        this.roomX = null;
        this.roomY = null;
        this.roomX2 = null;
        this.roomY2 = null;
        this.roomWidth = null;
        this.roomHeight = null;

        /**@type {Cell[]} */
        this.vNeighbours = [];
        /**@type {Cell[]} */
        this.hNeighbours = [];

        /**
         * @type {Hall[]}
         */
        this.hHall = [];

        /**
         * @type {Hall[]}
         */
        this.vHall = []
    }

    leftLeaf() {
        if (this.left.left) {
            return this.left.leftLeaf();
        } else {
            return this.left;
        }
    }

    divide(minDimensions) {
        if (this.width < minDimensions && this.height < minDimensions) {
            return false;
        }
        if (this.left !== null) {
            if (Math.random() > 0.5) {
                return this.left.divide(minDimensions);
            } else {
                return this.right.divide(minDimensions);
            }
        }
        if (this.width > this.height) {
            const newWidth = this.x + Math.floor((Math.random() * 0.45 + 0.45) * this.width)
            this.left = new Cell(this.x, this.y, newWidth, this.y2);
            this.right = new Cell(newWidth, this.y, this.x2, this.y2);
        } else {
            const newHeight = this.y + Math.floor((Math.random() * 0.45 + 0.45) * this.height);
            this.left = new Cell(this.x, this.y, this.x2, newHeight);
            this.right = new Cell(this.x, newHeight, this.x2, this.y2);
        }
        return true;
    }
    shrink(minDimensions) {
        if (this.left !== null) {
            this.left.shrink(minDimensions);
            this.right.shrink(minDimensions);
        } else {
            const newWidth = Math.floor(Math.max(minDimensions, (Math.random() * 0.45 + 0.45) * this.width))
            const newHeight = Math.floor(Math.max(minDimensions, (Math.random() * 0.45 + 0.45) * this.height))
            this.roomX = this.x + Math.floor((this.width - newWidth) * 0.5)
            this.roomX2 = this.roomX + newWidth
            this.roomY = this.y + Math.floor((this.height - newHeight) * 0.5);
            this.roomY2 = this.roomY + newHeight;
            this.roomWidth = newWidth;
            this.roomHeight = newHeight;

        }
    }

    getLeaves(cells) {
        if (this.left) {
            this.left.getLeaves(cells);
            this.right.getLeaves(cells)
        } else {
            cells.push(this);
        }
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        if (this.left !== null) {
            this.left.draw(ctx);
            this.right.draw(ctx);
        } else {
            // if (Math.random() > 0.9) {
            //     console.log(this.hNeighbours)
            //     console.log(this.hHall)
            // }

            // Example: Lush Meadow
            // #3d2b1f
            ctx.fillStyle = '#567d46';
            // ctx.fillStyle = '#3d2b1f';

            // ctx.strokeRect(this.x, this.y, this.width, this.height);
            if (this.roomHeight) {
                ctx.fillRect(this.roomX, this.roomY, this.roomWidth, this.roomHeight);
            }

            for (let i = 0; i < 3; i++) {

                for (const h of this.hHall) {
                    h.draw(ctx);
                }
                for (const v of this.vHall) {
                    v.draw(ctx);
                }
            }
            // }

        }

    }
}