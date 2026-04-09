


/**@type {HTMLCanvasElement} */
const canvas = myCanvas;
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const m = new MapDungeon();
m.divide();
m.getNeighbours();
m.shrink();
m.addHalls();


console.log(m)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    m.draw(ctx);
    requestAnimationFrame(draw);

}

draw();