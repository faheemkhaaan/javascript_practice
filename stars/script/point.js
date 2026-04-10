

class Point {
    constructor(pos, radius) {
        this.pos = pos;
        this.speed = new Vector(Math.random() * 7 + 3, Math.random() * 12 + 3)
        this.friction = new Vector(0.95, 0.95);
        this.radius = radius;
    }


    handleWallCollision() {
        if (this.pos.x + this.radius >= width || this.pos.x - this.radius <= 0) this.speed.x *= -1;
        if (this.pos.y + this.radius >= height || this.pos.y - this.radius <= 0) this.speed.y *= -1;
    }
    handleCollisionWithAPoint(point) {
        const dist = this.pos.distfrom(point.pos);
        const minDistance = point.radius + this.radius;

        if (dist <= minDistance) {
            // 1. POSITION CORRECTION (Static Resolution)
            // This stops them from overlapping
            const diff = this.pos.sub(point.pos);
            const unit = diff.normalize(); // The direction from point to this
            const overlap = minDistance - dist;

            // Move this point out of the collision half-way
            // (Or fully if 'point' is static)
            this.pos = this.pos.add(unit.mult(overlap));

            // 2. VELOCITY RESOLUTION (The Bounce)
            // Formula: v = v - 2 * (v ⋅ n) * n
            // 'unit' is our normal (n)

            const dot = this.speed.dot(unit);

            // Only bounce if the point is actually moving TOWARDS the other point
            if (dot < 0) {
                const bounce = unit.mult(2 * dot);
                this.speed = this.speed.sub(bounce);

                // Optional: Add a bit of energy loss (restitution)
                // this.speed = this.speed.mul(0.9); 
            }
        }
    }
    update(p) {


        // this.speed
        this.pos = this.pos.add(this.speed);
        // this.pos.y += gravity;

        // this.speed = this.speed.mul(this.friction);
        this.handleCollisionWithAPoint(p);

        this.handleWallCollision();
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}