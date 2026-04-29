class Fish {
    constructor(x, y, color, sprites, radius = 4) {
        this.pos = new Vector(x, y);
        this.vel = new Vector((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
        this.acc = new Vector(0, 0);
        
        this.radius = radius;
        this.baseSize = 24; 
        this.scale = radius / 8;
        
        this.color = color;
        this.sprites = sprites;
        this.mass = radius; 
        
        // Boids & Movement Properties
        this.maxSpeed = 2.5 + (1 / radius); 
        this.maxForce = 0.1;
        this.viewDistance = radius * 8; // Perception radius for flocking
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mul(0);

        const r = this.radius;
        if (this.pos.x + r > width) {
            this.pos.x = width - r;
            this.vel.x *= -1;
        } else if (this.pos.x - r < 0) {
            this.pos.x = r;
            this.vel.x *= -1;
        }

        if (this.pos.y + r > height) {
            this.pos.y = height - r;
            this.vel.y *= -1;
        } else if (this.pos.y - r < 0) {
            this.pos.y = r;
            this.vel.y *= -1;
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    // Boids Simulation AI
    flock(grid) {
        let sepX = 0, sepY = 0;
        let aliX = 0, aliY = 0;
        let cohX = 0, cohY = 0;
        let sepCount = 0, aliCount = 0, cohCount = 0;

        const col = (this.pos.x / grid.cellSize) | 0;
        const row = (this.pos.y / grid.cellSize) | 0;
        const perceptionSq = this.viewDistance * this.viewDistance;
        const separationSq = (this.radius * 3) * (this.radius * 3);

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < grid.rows && c >= 0 && c < grid.cols) {
                    const cell = grid.cells[r * grid.cols + c];
                    for (let i = 0; i < cell.length; i++) {
                        const other = cell[i];
                        if (other === this) continue;

                        const dx = other.pos.x - this.pos.x;
                        const dy = other.pos.y - this.pos.y;
                        const dSq = dx * dx + dy * dy;

                        if (dSq < perceptionSq) {
                            const d = Math.sqrt(dSq);
                            
                            // 1. Separation (Move away)
                            if (dSq < separationSq) {
                                sepX += (this.pos.x - other.pos.x) / d;
                                sepY += (this.pos.y - other.pos.y) / d;
                                sepCount++;
                            }

                            // 2. Alignment (Match velocity)
                            aliX += other.vel.x;
                            aliY += other.vel.y;
                            aliCount++;

                            // 3. Cohesion (Move to center)
                            cohX += other.pos.x;
                            cohY += other.pos.y;
                            cohCount++;
                        }
                    }
                }
            }
        }

        // Apply weights to forces
        if (sepCount > 0) {
            const sep = this.steer(sepX / sepCount, sepY / sepCount);
            sep.mul(1.5);
            this.applyForce(sep);
        }
        if (aliCount > 0) {
            const ali = this.steer(aliX / aliCount, aliY / aliCount);
            ali.mul(1.0);
            this.applyForce(ali);
        }
        if (cohCount > 0) {
            const coh = this.steer((cohX / cohCount) - this.pos.x, (cohY / cohCount) - this.pos.y);
            coh.mul(1.0);
            this.applyForce(coh);
        }

        // Keep ray tracing as an extra "Avoidance" layer for emergency obstacles
        this.detectAndAvoid(grid);
    }

    // Helper to calculate steering vector towards a target
    steer(tx, ty) {
        const v = new Vector(tx, ty);
        if (v.magSq() > 0) {
            v.setMag(this.maxSpeed);
            v.sub(this.vel);
            v.limit(this.maxForce);
        }
        return v;
    }

    detectAndAvoid(grid) {
        const vNorm = new Vector(this.vel.x, this.vel.y).normalize();
        const rays = [vNorm, this.rotateVector(vNorm, 0.4), this.rotateVector(vNorm, -0.4)];
        
        const col = (this.pos.x / grid.cellSize) | 0;
        const row = (this.pos.y / grid.cellSize) | 0;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < grid.rows && c >= 0 && c < grid.cols) {
                    const cell = grid.cells[r * grid.cols + c];
                    for (let i = 0; i < cell.length; i++) {
                        const other = cell[i];
                        if (other === this) continue;

                        const tox = other.pos.x - this.pos.x;
                        const toy = other.pos.y - this.pos.y;
                        const distSq = tox * tox + toy * toy;
                        
                        if (distSq < (this.radius * 5) * (this.radius * 5)) {
                            for (const ray of rays) {
                                const dot = tox * ray.x + toy * ray.y;
                                if (dot > 0 && dot < this.radius * 5) {
                                    const px = ray.x * dot;
                                    const py = ray.y * dot;
                                    const pdx = tox - px;
                                    const pdy = toy - py;
                                    if (pdx * pdx + pdy * pdy < (other.radius + this.radius) ** 2) {
                                        const avoid = this.steer(this.pos.x - other.pos.x, this.pos.y - other.pos.y);
                                        avoid.mul(2.0); // Emergency avoidance is strong
                                        this.applyForce(avoid);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    rotateVector(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
    }

    draw(ctx) {
        const angle = Math.atan2(this.vel.y, this.vel.x);
        let index = Math.round((angle / (Math.PI * 2)) * 8);
        while (index < 0) index += 8;
        index = index % 8;

        const baseSize = 24; 
        const drawSize = baseSize * (this.radius / 8); 
        
        ctx.drawImage(
            this.sprites,
            index * baseSize, 0, baseSize, baseSize,
            this.pos.x - drawSize / 2, this.pos.y - drawSize / 2, drawSize, drawSize
        );
    }

    static preRenderFish(color) {
        const size = 24; 
        const canvas = document.createElement('canvas');
        canvas.width = size * 8;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.save();
            ctx.translate(i * size + size / 2, size / 2);
            ctx.rotate(angle);
            const bodyW = size * 0.45;
            const bodyH = size * 0.25;
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, bodyW, bodyH, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-bodyW * 0.7, 0);
            ctx.lineTo(-bodyW * 1.2, -bodyH);
            ctx.lineTo(-bodyW * 1.2, bodyH);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(bodyW * 0.6, -bodyH * 0.3, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        return canvas;
    }

    static resolveCollision(b1, b2) {
        const dx = b1.pos.x - b2.pos.x;
        const dy = b1.pos.y - b2.pos.y;
        const distSq = dx * dx + dy * dy;
        const minDist = b1.radius + b2.radius;
        if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq) || 0.0001;
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            const moveX = nx * (overlap / 2);
            const moveY = ny * (overlap / 2);
            b1.pos.x += moveX;
            b1.pos.y += moveY;
            b2.pos.x -= moveX;
            b2.pos.y -= moveY;
            const rvx = b1.vel.x - b2.vel.x;
            const rvy = b1.vel.y - b2.vel.y;
            const spr = rvx * nx + rvy * ny;
            if (spr < 0) {
                b1.vel.x -= spr * nx;
                b1.vel.y -= spr * ny;
                b2.vel.x += spr * nx;
                b2.vel.y += spr * ny;
            }
        }
    }
}
