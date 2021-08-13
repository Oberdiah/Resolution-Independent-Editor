import * as twgl from '/node_modules/twgl.js/dist/4.x/twgl-full.module.js';
import * as dat from '/node_modules/dat.gui/build/dat.gui.module.js';

const gui = new dat.GUI({name: "Cool Editor"});
createBrushUI(gui);

const frag = await (await fetch('frag.fs')).text();
const vert = await (await fetch('vert.vs')).text();

const startText = "// ### Modes ###";
const endText = "// ### End Modes ###";

const start = frag.indexOf(startText) + startText.length;
const end = frag.indexOf(endText);
const split = frag.slice(start, end).split("\r\n");
for (const s in split) {
    const str = split[s];
    if (str.includes("#define")) {
        const values = str.split(" ").slice(1, 3);
        window[values[0]] = parseInt(values[1]);
    }
}

const canvas = document.getElementById('canvasgl');
const gl = twgl.getContext(canvas, { depth: false, antialiasing: false });

const programInfo = twgl.createProgramInfo(gl, [vert, frag]);

const arrays = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL,0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    const width = gl.canvas.width;
    const height = gl.canvas.height;

    gl.viewport(0, 0, width, height);

    gl.useProgram(programInfo.program);

    runActions();

    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.R32UI,
        SIDE_LENGTH, SIDE_LENGTH, 0,
        gl.RED_INTEGER, gl.UNSIGNED_INT,
        megaBuf
    );
    const loc=gl.getUniformLocation(programInfo.program,'u_samp');
    gl.uniform1i(loc,0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,tex);

    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, {
        time: time * 0.001,
        resolution: [width, height],
        mouseLocation: [mousePos.x/width, mousePos.y/height],
    });

    twgl.drawBufferInfo(gl, bufferInfo);
    mouseWasDown = mouseDown;
    requestAnimationFrame(render);
}

canvas.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = gl.canvas.clientHeight - e.clientY;
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

requestAnimationFrame(render);