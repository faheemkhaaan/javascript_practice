
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
}