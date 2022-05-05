class GridArray extends Array {
    constructor(w, h=w) {
        super(w*h);
        this.width = w;
        this.height = h;
    }

    getIndex(x, y) { return this.width*y + x; }
    getCoord(i) { return v2.new(i%this.width, Math.floor(i/this.width)); }
    getValue(x, y) { return this[this.width*y+x]; }
    setValue(x, y, val) { this[this.width*y+x] = val; }
}

class v2 {
    static new(x=0, y=x) { return new v2(x, y); }
    constructor(x, y) { this.x = x; this.y = y; }

    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    mult(v) { this.x *= v; this.y *= v; return this; }
}