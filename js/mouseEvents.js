canvas.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX * camera.scale;
    mousePos.y = (gl.canvas.clientHeight - e.clientY) * camera.scale;
});

canvas.addEventListener('mouseleave', () => {
    // mousePos.x = gl.canvas.clientWidth * 0.5;
    // mousePos.y = gl.canvas.clientHeight * 0.5;
    buttonsPressed = 0;
});

canvas.addEventListener('mousedown', e => {
    if (!io.WantCaptureMouse) {
        buttonsPressed = e.buttons;
    }
});

window.addEventListener('mouseup', () => {
    if (!io.WantCaptureMouse) {
        buttonsPressed = 0;
    }
});

window.addEventListener('wheel', (event) => {
    if (!io.WantCaptureMouse) {
        const delta = Math.sign(event.deltaY);
        s_brushSize[0] *= 1 + (-delta * 0.2);
        s_brushSize[0] = clamp(s_brushSize[0], BRUSH_SIZE_MIN, BRUSH_SIZE_MAX)
    }
});

function handleTouch(e) {
    e.preventDefault();
    mousePos.x = e.touches[0].x;
    mousePos.y = e.touches[0].y;
}

canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('touchstart', handleTouch, {passive: false});
canvas.addEventListener('touchmove', handleTouch, {passive: false});