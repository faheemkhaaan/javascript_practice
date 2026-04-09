


class Hall {
    constructor(x, y, x2, y2) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
    }
}