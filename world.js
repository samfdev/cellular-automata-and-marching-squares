const cam = {
    pos: v2.new(),
    vel: v2.new(),
    zoom: 10,
    zoomVel: 0,
    slide() {
        this.pos.add(this.vel);
        this.vel.mult(0.9);
        this.zoom += this.zoomVel
        this.zoomVel *= 0.9;
        this.zoom = Math.min(70, Math.max(10, this.zoom));
        this.pos.x = Math.min(this.zoom*20, Math.max(-this.zoom*20, this.pos.x));
        this.pos.y = Math.min(this.zoom*20, Math.max(-this.zoom*20, this.pos.y));
    }
}

// TODO: Seed
function generateIsland(size) {
    let map = new GridArray(size);

    // Init
    for (let i = 0; i < map.length; i++) {
        const pos = map.getCoord(i);
        map[i] = (Math.hypot(map.width/2 - pos.x, map.height/2 - pos.y)) / (size*0.65) > Math.random() ? 0 : 1;
    }

    // Cellular Auto.
    for (let step = 6; step > 0; step--) {
        let buffer = map;
        for (let i = 0; i < map.length; i++) {
            const pos = buffer.getCoord(i);
            const neighbors =
                (pos.y>0&&buffer.getValue(pos.x, pos.y-1))              // Above
                +(pos.x>0&&buffer.getValue(pos.x-1, pos.y))             // Left
                +(pos.y<buffer.height&&buffer.getValue(pos.x, pos.y+1)) // Below
                +(pos.x<buffer.width&&buffer.getValue(pos.x+1, pos.y))  // Right
                +(pos.x>0&&pos.y>0&&buffer.getValue(pos.x-1, pos.y-1))                         // Above+Left
                +(pos.x>0&&pos.y<buffer.height&&buffer.getValue(pos.x-1, pos.y+1))             // Bottom+Left
                +(pos.x<buffer.width&&pos.y>0&&buffer.getValue(pos.x+1, pos.y-1))              // Above+Right
                +(pos.x<buffer.width&&pos.y<buffer.height&&buffer.getValue(pos.x+1, pos.y+1)); // Below+Right

                if (buffer[i] && neighbors < 4) map[i] = 0;
                else if (neighbors > 4) map[i] = 1;
        }
    }

    // Edge trim (for rendering performance)
    let cutL = cutT = size; // Left, top
    let cutR = cutB = 0;    // Right, bottom
    for (let i = 0; i < map.length-map.width; i++) {
        if (map[i] !== 0) {
            const pos = map.getCoord(i);
            if (pos.x > cutR) cutR = pos.x;
            if (pos.x < cutL) cutL = pos.x;
            if (pos.y > cutB) cutB = pos.y;
            if (pos.y < cutT) cutT = pos.y;
        }
    }

    // Top & Bottom
    for (cutT; cutT > 0; cutT--) { map.splice(0, map.width); map.height--; cutB--; }
    for (cutB = map.height-cutB; cutB > 1; cutB--) { map.splice(map.length-map.width, map.width); map.height--; }
    // Sides
    for (let i = map.length; i >= 0; i--) if (i%map.width === 0) map.splice(i, cutL); map.width -= cutL; cutR -= cutL;
    cutR = map.width-cutR-1;
    for (let i = map.length; i >= 0; i--) if (i%map.width === map.width-cutR) map.splice(i, cutR); map.width -= cutR;

    // Grass
    const BEACHSIZE = 3;
    for (let i = 0; i < map.length; i++) {
        if (map[i] === 0) continue;
        const cent = map.getCoord(i);
        const r = Math.round(BEACHSIZE+Math.random());
        if (cent.x > r+1 && cent.y > r+1 && cent.y < map.height-r-1 && cent.x < map.width-r-1) {
            let isGrass = true;
            for (let k = map.getIndex(cent.x-r, cent.y-r); k < map.getIndex(cent.x+r, cent.y+r); k++) {
                if (k%map.width === cent.x - r) for (let j = 0; j < r*2+1; j++) {
                    const pos = map.getCoord(k+j);
                    if (Math.hypot(cent.x-pos.x, cent.y-pos.y) < r && map[k+j] === 0) isGrass = false; 
                }
            }
            if (isGrass) {
                const chance = Math.random();
                if (chance < 0.02) map[i] = 5;
                else if (chance < 0.06) map[i] = 4;
                else if (chance < 0.5) map[i] = 3;
                else map[i] = 2;
            }
        }
    }

    return map;
}