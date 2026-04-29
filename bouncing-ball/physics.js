class Physics {
    constructor(grid) {
        this.grid = grid;
    }

    /**
     * Process one physics step for the entire simulation
     * @param {Array} entities - List of entities to update and resolve
     */
    step(entities) {
        // 1. First Pass: Update grid positions
        this.grid.clear();
        for (let i = 0; i < entities.length; i++) {
            this.grid.add(entities[i]);
        }

        // 2. Second Pass: AI & Behavior (Flocking / Steering)
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            
            // Priority 1: Flocking behaviors (Alignment, Cohesion, Separation)
            if (entity.flock) {
                entity.flock(this.grid);
            } else if (entity.detectAndAvoid) {
                // Fallback to simple ray-based avoidance if flocking isn't defined
                entity.detectAndAvoid(this.grid);
            }
            
            // Priority 2: Physics integration (Move based on forces)
            entity.update();
        }

        // 3. Third Pass: Hard Physical Collision Resolution
        this.resolveCollisions();
    }

    resolveCollisions() {
        const grid = this.grid;
        const rows = grid.rows;
        const cols = grid.cols;
        const cells = grid.cells;

        const neighbors = [
            { dr: 0, dc: 1 },  // Right
            { dr: 1, dc: -1 }, // Bottom-Left
            { dr: 1, dc: 0 },  // Bottom
            { dr: 1, dc: 1 }   // Bottom-Right
        ];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cellIndex = r * cols + c;
                const cell = cells[cellIndex];
                
                for (let i = 0; i < cell.length; i++) {
                    const b1 = cell[i];
                    for (let j = i + 1; j < cell.length; j++) {
                        b1.constructor.resolveCollision(b1, cell[j]);
                    }
                    for (let n = 0; n < neighbors.length; n++) {
                        const nr = r + neighbors[n].dr;
                        const nc = c + neighbors[n].dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            const neighborCell = cells[nr * cols + nc];
                            for (let k = 0; k < neighborCell.length; k++) {
                                b1.constructor.resolveCollision(b1, neighborCell[k]);
                            }
                        }
                    }
                }
            }
        }
    }
}
