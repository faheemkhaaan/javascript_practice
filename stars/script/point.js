

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
        if (dist < point.radius + this.radius) {

            console.log('Collision detected');
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