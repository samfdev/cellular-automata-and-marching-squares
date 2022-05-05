const canv = document.querySelector('canvas#terrain');
const ctx = canv.getContext('2d');
Input.init();

let map = generateIsland(70);

function render() {
    for (let i = 0; i < map.length; i++) {
        switch (map[i]) {
            case 1: ctx.fillStyle = '#f2b888'; break; // Sand
            case 2: ctx.fillStyle = '#a6b04f'; break; // Grass
            case 3: ctx.fillStyle = '#819447'; break; // Bush
            case 4: ctx.fillStyle = '#734c44'; break; // Tree
            case 5: ctx.fillStyle = '#546756'; break; // Rock
            default: continue;
        }
        ctx.fillRect(
            Math.floor(map.getCoord(i).x*cam.zoom-cam.pos.x) + Math.floor((canv.width-map.width*cam.zoom)/2),
            Math.floor(map.getCoord(i).y*cam.zoom-cam.pos.y) + Math.floor((canv.height-map.height*cam.zoom)/2),
            Math.ceil(cam.zoom), Math.ceil(cam.zoom)
        );
    }
}

$(window).bind('mousewheel', e => { cam.zoomVel -= e.originalEvent.wheelDelta*0.01; });

(function loop() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    
    cam.vel.add(v2.new(
        Input.isKeyDown('d')?1:0+Input.isKeyDown('a')?-1:0,
        Input.isKeyDown('s')?1:0+Input.isKeyDown('w')?-1:0,
    ));
    cam.slide();

    // if (Input.isKeyDown('r')) map = generateIsland(73);
    
    render();
    requestAnimationFrame(loop);
})();

resize();