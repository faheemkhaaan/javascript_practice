
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


const m1 = new MapDengen();
m1.divide();
m1.getNeighbours()
m1.shrink()
m1.addHalls();
m1.snap()

console.log(m1)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    addGrid()
    m1.display(ctx);
    // console.log(m1)

    requestAnimationFrame(draw);
}
draw();


function addGrid() {
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    ctx.strokeStyle = 'black'
}