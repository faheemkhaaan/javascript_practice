

class Wall {
    constructor(pos) {
        this.pos = pos;
        this.size = new Vector(50, 50);
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}