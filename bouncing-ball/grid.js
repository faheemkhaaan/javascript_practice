class Grid {
    constructor(width, height, cellSize) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.cells = new Array(this.cols * this.rows);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = [];
        }
    }

    clear() {
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].length = 0;
        }
    }

    add(entity) {
        const col = (entity.pos.x / this.cellSize) | 0;
        const row = (entity.pos.y / this.cellSize) | 0;
        
        const c = Math.max(0, Math.min(this.cols - 1, col));
        const r = Math.max(0, Math.min(this.rows - 1, row));
        
        this.cells[r * this.cols + c].push(entity);
    }
}
