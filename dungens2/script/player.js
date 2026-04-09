
class Player {
    constructor(pos, size, leftRoom) {
        const startX = leftRoom.roomX + (leftRoom.roomWidth / 2) - (size.x / 2);
        const startY = leftRoom.roomY + (leftRoom.roomHeight / 2) - (size.y / 2);
        this.pos = new Vector(startX, startY)
        this.size = size;
        this.isPlayerMoving = false;
        this.keys = {
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false
        };
        this.leftRoom = leftRoom;
        console.log(this.leftRoom, this.pos);
        this.addEventListeners();
    }


    addEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
                this.isPlayerMoving = true;
            }
        });
        document.addEventListener("keyup", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.isPlayerMoving = false;
                this.keys[e.key] = false;
            }
        })
    };

    isPointWalkable(x, y, cells) {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];

            if (x >= cell.roomX && x <= cell.roomX2 && y >= cell.roomY && y <= cell.roomY2) {
                return true;
            }
            for (const h of cell.hHall) {
                if (x >= h.x && x < h.x2 && y >= h.y && y <= h.y2) {
                    return true;
                }
            }
            for (const v of cell.vHall) {
                if (x >= v.x && x <= v.x2 && y >= v.y && y <= v.y2) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveTo(newX, newY, cells) {

        const corners = [
            { x: newX, y: newY },
            { x: newX + this.size.x, y: newY },
            { x: newX, y: newY + this.size.y },
            { x: newX + this.size.x, y: newY + this.size.y },
        ];

        for (const corner of corners) {
            if (!this.isPointWalkable(corner.x, corner.y, cells)) {
                return false
            }
        };
        return true;
    }

    move(cells) {
        let dx = 0;
        let dy = 0;
        const speed = 8;
        if (this.keys.ArrowDown) {
            dy += speed;
        }
        if (this.keys.ArrowUp) {
            dy -= speed;
        }
        if (this.keys.ArrowLeft) {
            dx -= speed;
        }
        if (this.keys.ArrowRight) {
            dx += speed;
        };

        if (dx !== 0 && this.canMoveTo(this.pos.x + dx, this.pos.y, cells)) {
            this.pos.x += dx;
        }

        // Try moving on the Y axis independently
        if (dy !== 0 && this.canMoveTo(this.pos.x, this.pos.y + dy, cells)) {
            this.pos.y += dy;
        }
    }

    update(cells) {
        this.move(cells);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'lightblue'
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}