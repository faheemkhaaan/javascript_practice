



class Canvas {
    constructor() {
        /** @type {HTMLCanvasElement} */
        this.canvas = myCanvas;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
    }

    clearWhole() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

}

class InfoBar {
    constructor() {

    }
    #box() {
        this.container = document.createElement('table');

    }
}

class EventListener {
    constructor() {
        this.mousePos = { x: null, y: null };

        this.#addEventistener();
    }

    #addEventistener() {
        document.addEventListener('mousedown', this.onMouseDown.bind(this));

    }

    onMouseDown() {

    }
    onMouseUp() {

    }
}

class BouncingBall {
    constructor(pos) {
        this.pos = pos;
        this.radius = 50;
        this.speed = { x: 0, y: 0 };
        this.maxSpeed = 4;
        this.acceleration = 0.5;
        this.friction = 0.5;
        this.event = new EventListener();
    }

    update() {

        this.speed.x += this.acceleration;
        this.speed.y += 0.09;

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;

        this.speed.x = Math.max(-this.maxSpeed, Math.min(this.speed.x, this.maxSpeed));

        // this.pos.y = Math.max(0, Math.min(this.pos.x, c.height));

        if (this.pos.y >= c.height * 0.8) {
            this.speed.y *= -1;
        }


        if (this.pos.x >= c.width - this.radius) {
            this.speed.x *= -1;
            this.acceleration *= -1;
        }
        if (this.pos.x <= this.radius) {
            this.speed.x *= -1;
            this.acceleration *= -1;
        }

        this.speed.x *= this.friction;

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
    */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

const c = new Canvas();
const ball = new BouncingBall({ x: 50, y: 50 });


animate();
function animate() {
    c.clearWhole();

    ball.update();
    ball.draw(c.ctx);


    requestAnimationFrame(animate);

}