/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballCountDisplay = document.getElementById('ball-count');
const sizeSlider = document.getElementById('size-slider');

let width, height;
let entities = [];
let grid;
let physics;

// Configuration
let currentRadius = parseInt(sizeSlider.value);
const ENTITY_COUNT = 30;
const CELL_SIZE = 60;

const colorPalettes = [
    { r: 255, g: 99, b: 71 },
    { r: 30, g: 144, b: 255 },
    { r: 50, g: 205, b: 50 },
    { r: 255, g: 215, b: 0 }
];

let preRenderedSprites = [];

function init() {
    resize();
    entities = [];
    preRenderedSprites = colorPalettes.map(color => Fish.preRenderFish(color));

    for (let i = 0; i < ENTITY_COUNT; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorIdx = Math.floor(Math.random() * colorPalettes.length);
        const sprite = preRenderedSprites[colorIdx];
        const radius = currentRadius * (0.8 + Math.random() * 0.4);
        entities.push(new Fish(x, y, colorPalettes[colorIdx], sprite, radius));
    }
    ballCountDisplay.innerText = ENTITY_COUNT.toLocaleString();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    grid = new Grid(width, height, CELL_SIZE);
    physics = new Physics(grid); // Re-initialize physics with new grid on resize
}

function animate() {
    // 1. Scene Background
    ctx.fillStyle = 'rgba(10, 10, 12, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // 2. Physics Simulation Step
    physics.step(entities);

    // 3. Rendering Step
    for (let i = 0; i < entities.length; i++) {
        entities[i].draw(ctx);
    }

    requestAnimationFrame(animate);
}

// Interaction: Dynamic size update
sizeSlider.addEventListener('input', (e) => {
    const newBaseRadius = parseInt(e.target.value);
    const ratio = newBaseRadius / currentRadius;

    for (let i = 0; i < entities.length; i++) {
        const fish = entities[i];
        fish.radius *= ratio;
        fish.viewDistance = fish.radius * 10;
    }
    currentRadius = newBaseRadius;
});

window.addEventListener('resize', resize);
init();
requestAnimationFrame(animate);