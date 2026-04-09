
/**@type {HTMLCanvasElement} */
const canvas = myCanvas;
const ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const world = new World();

// m.snap()

function draw() {
    ctx.clearRect(0, 0, width, height);
    world.draw(ctx);
    world.update()
    // drawGrid()
    requestAnimationFrame(draw);
}

draw();


function drawGrid() {
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height);
        ctx.stroke()
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}