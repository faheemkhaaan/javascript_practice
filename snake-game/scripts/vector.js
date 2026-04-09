

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };


    /**
     * 
     * @param {Vector} other 
     * @returns 
     */
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    norm(factor) {
        const magnitude = this.mag();
        if (magnitude > 0) {
            const x = (this.x / magnitude) * factor;
            const y = (this.y / magnitude) * factor;
            return new Vector(x, y);
        };
        return this;
    }

    mag() {
        return Math.hypot(this.x, this.y);
    }
}