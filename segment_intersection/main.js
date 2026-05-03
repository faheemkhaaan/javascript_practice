

/**
 * @type {HTMLCanvasElement}
 */
const canvas = myCanavs;
const ctx = canvas.getContext("2d");


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const A = new Vector(200, 150);
const B = new Vector(150, 250);
const C = new Vector(50, 100);
const D = new Vector(250, 200);
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

function getIntersection(A, B, C, D) {

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
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.x - A.x) * (B.y - A.y) - (B.x - A.x) * (C.y - A.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);


    if (bottom !== 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            const p = new Vector(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
            p.offset = t;
            return p
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