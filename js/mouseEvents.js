canvas.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX * camera.scale;
    mousePos.y = (gl.canvas.clientHeight - e.clientY) * camera.scale;
});

canvas.addEventListener('mouseleave', () => {
    // mousePos.x = gl.canvas.clientWidth * 0.5;
    // mousePos.y = gl.canvas.clientHeight * 0.5;
    mouseDown = false;
});

canvas.addEventListener('mousedown', e => {
    mouseDown = true;
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
});

function handleTouch(e) {
    e.preventDefault();
    mousePos.x = e.touches[0].x;
    mousePos.y = e.touches[0].y;
}

canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('touchstart', handleTouch, {passive: false});
canvas.addEventListener('touchmove', handleTouch, {passive: false});