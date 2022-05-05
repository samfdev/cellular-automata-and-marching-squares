const mouse = {
    pos: v2.new(),
    old: v2.new(),
    delta: v2.new(),
    down: false,
}

// FIXME: Old mouse pos changes on mouse move, but only after first click (for some reason)
window.addEventListener('mousedown', () => { mouse.down = true; mouse.old = mouse.pos; });
window.addEventListener('mouseup', () => { mouse.down = false; });
window.addEventListener('mousemove', e => {
    mouse.delta = v2.new(e.x, e.y).sub(mouse.pos);
    mouse.pos.x = e.x; mouse.pos.y = e.y;
});

class Input {
    static #keyQueue = {};
    static isKeyDown(ch) {
        if (ch) return this.#keyQueue[ch.toLowerCase()]?this.#keyQueue[ch.toLowerCase()]:false;
        for (let key in this.#keyQueue) if (this.#keyQueue.hasOwnProperty(key) && this.#keyQueue[key]) return true;
        return false;
    }
    static init() {
        window.addEventListener('keydown', e => { this.#keyQueue[e.key] = true; });
        window.addEventListener('keyup', e => { this.#keyQueue[e.key] = false; });
    }
}

function resize() { for (let e of document.querySelectorAll('canvas')) { e.width = e.offsetWidth; e.height = e.offsetHeight; } }
window.addEventListener('resize', resize);