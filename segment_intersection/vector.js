
class Vector {
    constructor(x, y) {
        this.#validate(x, y);
        this.x = x;
        this.y = y;
    }

    #validate(x, y) {
        if (typeof x !== 'number') {
            throw new Error('x should be of type number');
        }
        if (typeof y !== 'number') {
            throw new Error('x should be of type number');
        }
    }

    /**
    * 
    * @param {Vector} v1 
    * @param {Vector} v2
    * @returns {Vector} 
    */
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y)
    }

    /**
     * 
     * @param {Vector} v1 
     * @param {Vector} v2
     * @returns {number} 
     */
    static cross(v1, v2) {
        return (v1.x * v2.y) - (v1.y * v2.x);
    }
}