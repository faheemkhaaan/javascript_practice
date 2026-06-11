

class Snake {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
        this.controls = new Controls();
        this.speed = 5;
        this.maxSpeed = 6;
        this.corners = [];
    };
    getIntersection(p1, p2, p3, p4) {
        const den = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        if (den === 0) return null; // Parallel lines

        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / den;
        const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / den;

        // If ua and ub are between 0 and 1, the segments intersect
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return {
                x: p1.x + ua * (p2.x - p1.x),
                y: p1.y + ua * (p2.y - p1.y),
                offset: ua
            };
        }
        return null;
    }

    checkRayCollision(delta, wall) {
        // Start ray from the center of the snake
        const start = {
            x: this.pos.x + this.size.x / 2,
            y: this.pos.y + this.size.y / 2
        };

        // End ray at the intended future position (plus some padding/buffer)
        const buffer = 1.5;
        const end = {
            x: start.x + delta.x * buffer,
            y: start.y + delta.y * buffer
        };

        // Define the 4 edges of the wall
        const wallEdges = [
            { p1: { x: wall.pos.x, y: wall.pos.y }, p2: { x: wall.pos.x + wall.size.x, y: wall.pos.y } }, // Top
            { p1: { x: wall.pos.x + wall.size.x, y: wall.pos.y }, p2: { x: wall.pos.x + wall.size.x, y: wall.pos.y + wall.size.y } }, // Right
            { p1: { x: wall.pos.x + wall.size.x, y: wall.pos.y + wall.size.y }, p2: { x: wall.pos.x, y: wall.pos.y + wall.size.y } }, // Bottom
            { p1: { x: wall.pos.x, y: wall.pos.y + wall.size.y }, p2: { x: wall.pos.x, y: wall.pos.y } }  // Left
        ];

        for (const edge of wallEdges) {
            const intersect = this.getIntersection(start, end, edge.p1, edge.p2);
            if (intersect) return true; // Collision detected
        }
        return false;
    }
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
            if (!this.checkRayCollision(delta, wall)) {
                this.pos.x += delta.x;
                this.pos.y += delta.y;
            }
        }


        // this.pos = this.pos.add(delta);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'orange'
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}