

/**
 * @type {HTMLCanvasElement}
 */
const canvas = myCanvas;
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const gravity = 0.9;

const p1 = new Point(new Vector(110, 110), 50);
const p2 = new Point(new Vector(110, 110), 50);

animte()
function animte() {
    clearCanvas()
    requestAnimationFrame(animte);

    p1.draw(ctx);
    p1.update(p2);

    p2.draw(ctx);
    p2.update(p1)


}


function clearCanvas() {
    ctx.clearRect(0, 0, width, height)
}