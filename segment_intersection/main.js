

/**
 * @type {HTMLCanvasElement}
 */
const canvas = myCanavs;
const ctx = canvas.getContext("2d");


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const A = new Vector(500, 650);
const B = new Vector(650, 750);
const C = new Vector(200, 300);
const D = new Vector(450, 600);

let angle = 0;
const mouse = new Vector(0, 0);
document.onmousemove = (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
}
animte()
function animte() {
    clearCanvas();

    const radius = 50;

    A.x = mouse.x + Math.cos(angle) * radius;
    A.y = mouse.y - Math.sin(angle) * radius;
    B.x = mouse.x - Math.cos(angle) * radius;
    B.y = mouse.y + Math.sin(angle) * radius;
    angle += 0.02

    drawLine(A, B);
    drawLine(C, D);
    drawLine(A, C);
    // drawLine()
    drawLabel(A, "A");
    drawLabel(B, "B");
    drawLabel(C, "C");
    drawLabel(D, "D");


    const I = getIntersection(A, B, C, D);
    if (I) {
        drawLabel(I, "I");
    }


    requestAnimationFrame(animte);
}

function drawLine(a, b) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}
/**
 * 
 * @param {Vector} a 
 */
function drawLabel(a, lable, isRed) {
    ctx.beginPath();
    ctx.fillStyle = isRed ? "red" : 'white';
    ctx.arc(a.x, a.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.font = "bold 14px Arial";
    ctx.fillText(lable, a.x, a.y);
}

/**
    Ix = Ax + (Bx-Ax)t = Cx + (Dx-Cx)u
    Iy = Ay + (By-Ay)t = Cy + (Dy-Cy)u 

    Ax + (Bx-Ax)t = Cx + (Dx-Cx)u | -Cx

    (Ax-Cx) + (Bx-Ax)t =(Dx-Cx)u

    Ay + (By-Ay)t = Cy + (Dy-Cy)u | -Cy

    (Ay-Cy) + (By-Ay)t = (Dy-Cy)u | * (Dx-Cx)

    (Dx-Cx)(Ay-Cy)+(Dx-Cx)(By-Ay)t = (Dy-Cy)(Dx-Cx)u

    (Dx-Cx)(Ay-Cy)+(Dx-Cx)(By-Ay)t = (Dy-Cy)(Ax-Cx) + (Dy-Cy)(Bx-Ax)t

    (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx) = (Dy-Cy)(Bx-Ax)t - (Dx-Cx)(By-Ay)t;

    (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx) = t((Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay));

    t =  (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx)
        (Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay);

    top =  (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx)
    bottom = (Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay)

    t= top / bottom


    Ix = Ax + (Bx-Ax)t = Cx + (Dx-Cx)u
    Iy = Ay + (By-Ay)t = Cy + (Dy-Cy)u 

    Ax + (Bx-Ax)t = Cx + (Dx-Cx)u

    (Bx-Ax)t = (Cx-Ax) + (Dx-Cx)u

    Ay + (By-Ay)t = Cy + (Dy-Cy)u

    (By-Ay)t = (Cy-Ay) + (Dy-Cy)u

    (Bx-Ax)(By-Ay)t = (Bx-Ax)(Cy-Ay)+(Bx-Ax)(Dy-Cy)u
    ((Cx-Ax) + (Dx-Cx)u) (By-Ay) = (Bx-Ax)(Cy-Ay)+(Bx-Ax)(Dy-Cy)u

    (Cx-Ax)(By-Ay) + (By-Ay)(Dx-Cx)u = (Bx-Ax)(Cy-Ay)+(Bx-Ax)(Dy-Cy)u

    (Cx-Ax)(By-Ay)-  (Bx-Ax)(Cy-Ay) = (Bx-Ax)(Dy-Cy)u- (By-Ay)(Dx-Cx)u
    
    (Cx-Ax)(By-Ay)-  (Bx-Ax)(Cy-Ay) = u ((Bx-Ax)(Dy-Cy) - (By-Ay)(Dx-Cx))

    uTop = (Cx-Ax)(By-Ay)-  (Bx-Ax)(Cy-Ay)
    uBottom = (Bx-Ax)(Dy-Cy) - (By-Ay)(Dx-Cx)

    u = uTop/uBottom

    uBottom = tBottom

 */
function getIntersection(A, B, C, D) {
    // 1. Line directions
    const AB = new Vector(B.x - A.x, B.y - A.y); // (r)
    const CD = new Vector(D.x - C.x, D.y - C.y); // (s)

    // 2. The connection vector (From A to C) to match your derivation math
    const AC = new Vector(C.x - A.x, C.y - A.y);

    const AD = Vector.sub(D, A);
    // 3. Keep the denominator aligned with standard cross products (AB x CD)
    const bottom = Vector.cross(AB, CD);

    if (bottom !== 0) {
        // 4. Using clean, matching standard cross products
        const tTop = Vector.cross(AC, CD); // Matches your derivation exactly
        const uTop = Vector.cross(AC, AB); // Matches your derivation exactly

        const t = tTop / bottom;
        const u = uTop / bottom;

        // 5. Check if intersection happens within the bounding segments
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            const p = new Vector(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
            p.offset = t;
            return p;
        }
    }
    return null;
}

function lerp(a, b, t) {
    return a + t * (b - a)
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}