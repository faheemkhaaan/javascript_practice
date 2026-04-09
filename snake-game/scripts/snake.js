

class Snake {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
        this.controls = new Controls();
        this.speed = 5;
        this.maxSpeed = 6;
        this.corners = [];
    };

    isPointWalkable(x, y, wall) {

        if (
            x <= wall.pos.x + wall.size.x &&
            x >= wall.pos.x &&
            y <= wall.pos.y + wall.size.y &&
            y >= wall.pos.y
        ) {
            return false;
        }
        return true;
    }

    canMoveTo(newX, newY, wall) {
        const corners = [
            { x: newX, y: newY },
            { x: newX + this.size.x, y: newY },
            { x: newX, y: newY + this.size.y },
            { x: newX + this.size.x, y: newY + this.size.y },
        ];

        for (const corner of corners) {
            if (!this.isPointWalkable(corner.x, corner.y, wall)) {
                return false
            }
        };
        return true;
    }
    update(wall) {
        let delta = new Vector(0, 0);
        const keys = this.controls.keys;

        if (keys.ArrowDown) delta.y += this.speed;
        if (keys.ArrowUp) delta.y -= this.speed;
        if (keys.ArrowLeft) delta.x -= this.speed;
        if (keys.ArrowRight) delta.x += this.speed;


        if (delta.mag() > 0) {
            delta = delta.norm(this.maxSpeed);
        }

        if (this.canMoveTo(this.pos.x + delta.x, this.pos.y, wall)) {
            this.pos.x += delta.x;
        }
        if (this.canMoveTo(this.pos.x, this.pos.y + delta.y, wall)) {
            this.pos.y += delta.y;
        }
        // this.pos = this.pos.add(delta);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'orange'
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}