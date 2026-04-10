class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distfrom(p) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    // Standard multiplication by a single number (scalar)
    mult(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    // Component-wise multiplication (useful for friction)
    mul(other) {
        return new Vector(this.x * other.x, this.y * other.y);
    }

    mag() {
        return Math.hypot(this.x, this.y);
    }

    normalize() {
        const m = this.mag();
        return m === 0 ? new Vector(0, 0) : new Vector(this.x / m, this.y / m);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
}