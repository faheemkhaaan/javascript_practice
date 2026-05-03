/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

// Offscreen canvas for low-res rendering
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false });

let width, height;
let renderScale = 0.5; // Render at 50% resolution for performance
const perlin = new Perlin();

// State variables
let noiseScale = 0.02;
let octaves = 3;
let persistence = 0.5;
let seaLevel = 0.45;
let needsUpdate = true;

// UI Elements
const scaleInput = document.getElementById('noise_scale');
const octaveInput = document.getElementById('octaves');
const persistenceInput = document.getElementById('persistence');
const seaInput = document.getElementById('sea_level');
const regenBtn = document.getElementById('regenerate');

const scaleVal = document.getElementById('scale_val');
const octaveVal = document.getElementById('octave_val');
const persVal = document.getElementById('pers_val');
const seaVal = document.getElementById('sea_val');

/**
 * Modern Terrain Colors (RGB)
 */
const COLORS = {
    DEEP_WATER: [15, 23, 42],      // Slate 900
    SHALLOW_WATER: [30, 64, 175],  // Blue 800
    SAND: [234, 179, 8],           // Yellow 500
    GRASS: [34, 197, 94],          // Green 500
    FOREST: [21, 128, 61],         // Green 700
    ROCK: [71, 85, 105],           // Slate 600
    SNOW: [248, 250, 252]          // Slate 50
};

function init() {
    resize();
    updateUI();
    animate();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Scale offscreen canvas
    offscreenCanvas.width = Math.floor(width * renderScale);
    offscreenCanvas.height = Math.floor(height * renderScale);

    needsUpdate = true;
}

function updateUI() {
    scaleVal.textContent = noiseScale.toFixed(3);
    octaveVal.textContent = octaves;
    persVal.textContent = persistence.toFixed(2);
    seaVal.textContent = seaLevel.toFixed(2);
}

function getColor(v) {
    if (v < seaLevel - 0.15) return COLORS.DEEP_WATER;
    if (v < seaLevel) return COLORS.SHALLOW_WATER;
    if (v < seaLevel + 0.05) return COLORS.SAND;
    if (v < 0.65) return COLORS.GRASS;
    if (v < 0.75) return COLORS.FOREST;
    if (v < 0.85) return COLORS.ROCK;
    return COLORS.SNOW;
}

function generate() {
    const sw = offscreenCanvas.width;
    const sh = offscreenCanvas.height;
    const imageData = offscreenCtx.createImageData(sw, sh);
    const data = imageData.data;

    // Use a local copy of noiseScale adjusted for the render scale
    const s = noiseScale / renderScale;

    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const nx = x * s;
            const ny = y * s;

            const noiseValue = perlin.getOctave(nx, ny, octaves, persistence);
            const color = getColor(noiseValue);

            const index = (y * sw + x) * 4;
            data[index] = color[0];
            data[index + 1] = color[1];
            data[index + 2] = color[2];
            data[index + 3] = 255;
        }
    }

    offscreenCtx.putImageData(imageData, 0, 0);

    // Draw offscreen to main canvas with smoothing disabled for "pixel art" look
    // or enabled for smooth look. We'll use smooth for "premium".
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offscreenCanvas, 0, 0, width, height);
}

function animate() {
    if (needsUpdate) {
        generate();
        needsUpdate = false;
    }
    // requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', () => {
    resize();
});

scaleInput.addEventListener('input', (e) => {
    noiseScale = parseFloat(e.target.value);
    updateUI();
    needsUpdate = true;
});

octaveInput.addEventListener('input', (e) => {
    octaves = parseInt(e.target.value);
    updateUI();
    needsUpdate = true;
});

persistenceInput.addEventListener('input', (e) => {
    persistence = parseFloat(e.target.value);
    updateUI();
    needsUpdate = true;
});

seaInput.addEventListener('input', (e) => {
    seaLevel = parseFloat(e.target.value);
    updateUI();
    needsUpdate = true;
});

regenBtn.addEventListener('click', () => {
    perlin.seed();
    needsUpdate = true;
});

// Start the engine
init();