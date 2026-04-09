


class World {

    constructor() {
        this.map = new DungenMap();



        this.mousePos = new Vector(0, 0);
        this.oldMousePos = this.mousePos;
        this.movedDistance = new Vector(0, 0);
        this.drag = false;


        this.setup();
        this.leftRoom = this.map.root.leftLeaf();
        this.player = new Player(new Vector(width * 0.5, height * 0.5), new Vector(50, 50), this.leftRoom)
        this.addEventListeners()
    }

    setup() {
        this.map.divide();
        this.map.getNeighbours();
        this.map.shrink();
        this.map.addHalls()
    };
    calculateOffset() {

        const screenCenter = new Vector(width * 0.5, height * 0.5);
        const targetPos = screenCenter.sub(this.player.size.mul(0.5));
        let centeringForce = targetPos.sub(this.player.pos).mul(0.1);

        if (centeringForce.mag() < 0.05) {
            centeringForce = new Vector(0, 0)
        }
        this.movedDistance = this.movedDistance.add(centeringForce);
        // console.log(this.player.pos);


    }
    addEventListeners() {
        document.addEventListener('mousedown', (e) => {
            this.drag = true;
            this.oldMousePos = new Vector(e.clientX, e.clientY);

        })
        document.addEventListener("mouseup", (e) => {
            this.drag = false;
            this.movedDistance = new Vector(0, 0)

        })
        document.addEventListener('mousemove', (e) => {
            if (!this.drag) return;
            const { clientX, clientY } = e;
            this.mousePos = new Vector(clientX, clientY);
            this.movedDistance = this.mousePos.sub(this.oldMousePos);
            this.oldMousePos = new Vector(this.mousePos.x, this.mousePos.y);

        });
    }
    update() {
        this.calculateOffset()
        this.player.update(this.map.cells);
        this.map.update(this.movedDistance);

        this.player.pos = this.player.pos.add(this.movedDistance)


        this.movedDistance = new Vector(0, 0)
    }


    draw(ctx) {
        this.map.draw(ctx);
        this.player.draw(ctx);
    }

}