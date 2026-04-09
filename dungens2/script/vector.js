

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    mul(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    sub(pos) {
        return new Vector(this.x - pos.x, this.y - pos.y)
    }

    mag() {
        return Math.hypot(this.x, this.y);
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }
}