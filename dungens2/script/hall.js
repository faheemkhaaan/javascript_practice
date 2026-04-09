

class Hall {
    constructor(x, y, x2, y2) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.width = this.x2 - this.x;
        this.height = this.y2 - this.y;


    }


    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#567d46'
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}