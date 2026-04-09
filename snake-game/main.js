


const canvas = getCanvas();
const ctx = canvas.getContext('2d');

ctx.fillRect(100, 100, 40, 40)

const snake = new Snake(new Vector(100, 100), new Vector(50, 50));

const wall = new Wall(new Vector(400, 300));
animate()
function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.update(wall);
    snake.draw(ctx);

    wall.draw(ctx);

}



function getCanvas() {
    const canvas = document.createElement("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    document.body.appendChild(canvas);
    return canvas;
}