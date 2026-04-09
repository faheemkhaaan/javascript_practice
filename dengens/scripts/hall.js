

class Hall {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }


    /**@param {CanvasRenderingContext2D} ctx */
    display(ctx) {
        ctx.beginPath();
        const w = this.x2 - this.x1;
        const h = this.y2 - this.y1;
        ctx.strokeRect(this.x1, this.y1, w, h);
    }
}