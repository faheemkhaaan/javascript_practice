

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

    mul(other) {
        return new Vector(this.x * other.x, this.y * other.y);
    }
}