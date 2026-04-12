

/**
 * @type {HTMLCanvasElement}
 */
const canvas = myCanvas;
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const gravity = 0.9;

const space = new Space()
function animte() {
    clearCanvas()
    requestAnimationFrame(animte);

    space.update();
    space.draw(ctx);
}
animte()


function clearCanvas() {
    ctx.clearRect(0, 0, width, height)
}