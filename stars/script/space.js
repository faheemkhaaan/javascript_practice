

class Space {
    constructor() {
        this.stars = Array.from({ length: 100 }, () => new Point(
            new Vector(
                Math.floor(Math.random() * (width * 0.9) + 10),
                Math.floor(Math.random() * (height * 0.9) + 10)),
            10));

    }

    update() {
        this.stars.forEach(s => s.update(this.stars))
    }

    draw(ctx) {
        this.stars.forEach(s => s.draw(ctx));
        this.stars.forEach(s => s.connectTo(ctx, this.stars));
    }
}