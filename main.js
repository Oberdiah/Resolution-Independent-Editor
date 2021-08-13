import * as twgl from '/twgl-full.module.js';
import * as dat from '/dat.gui.module.js';

const gui = new dat.GUI({name: "Cool Editor"});
createBrushUI(gui);

const frag = await (await fetch('frag.fs')).text();
const simpleFrag = await (await fetch('UIFrag.fs')).text();
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
const programInfoSimpleFrag = twgl.createProgramInfo(gl, [vert, simpleFrag]);

const windowVertArray = twgl.createBufferInfoFromArrays(gl, {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
});

const megaBufOptions = {
    width: SIDE_LENGTH,
    height: SIDE_LENGTH,
    internalFormat: gl.R32UI,
};

const interRenderOptions = {
    width: gl.canvas.width,
    height: gl.canvas.height,
    minMag: gl.NEAREST,
    maxLevel: 0,
}

const tex1Attachments = [{attachment: twgl.createTexture(gl, interRenderOptions)}];
const tex2Attachments = [{attachment: twgl.createTexture(gl, interRenderOptions)}];
const tex3Attachments = [{attachment: twgl.createTexture(gl, interRenderOptions)}];
const interRenderFB1 = twgl.createFramebufferInfo(gl, tex1Attachments);
const interRenderFB2 = twgl.createFramebufferInfo(gl, tex2Attachments);
const interRenderFB3 = twgl.createFramebufferInfo(gl, tex3Attachments);
const megaBufTex = twgl.createTexture(gl, megaBufOptions);

function renderWithBackground(background, writeTo) {
    gl.viewport(0, 0, width, height);
    gl.useProgram(programInfo.program);
    twgl.setUniformsAndBindTextures(programInfo, uniformInfo);

    twgl.setTextureFromArray(gl, megaBufTex, megaBuff, megaBufOptions)
    twgl.setBuffersAndAttributes(gl, programInfo, windowVertArray);
    twgl.setUniformsAndBindTextures(programInfo, {
        u_samp: megaBufTex,
        u_background: background.attachments[0],
    });
    twgl.bindFramebufferInfo(gl, writeTo);
    twgl.drawBufferInfo(gl, windowVertArray);
}

function splatToScreen(framebuffer) {
    gl.viewport(0, 0, width, height);
    gl.useProgram(programInfoSimpleFrag.program);
    twgl.setUniformsAndBindTextures(programInfoSimpleFrag, uniformInfo);

    twgl.setUniformsAndBindTextures(programInfoSimpleFrag, {
        u_sampleTex: framebuffer.attachments[0],
    });
    twgl.bindFramebufferInfo(gl, null);
    twgl.drawBufferInfo(gl, windowVertArray);
}

let currentBackground = interRenderFB1;
let writingAndDisplaying = interRenderFB2;
let uniformInfo = {};
function render(time) {
    // Pre frame
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    if (width !== gl.canvas.width || height !== gl.canvas.height) {
        width = gl.canvas.width;
        height = gl.canvas.height;
        twgl.resizeFramebufferInfo(gl, interRenderFB1, tex1Attachments, width, height);
        twgl.resizeFramebufferInfo(gl, interRenderFB2, tex2Attachments, width, height);
        twgl.resizeFramebufferInfo(gl, interRenderFB3, tex3Attachments, width, height);
    }

    uniformInfo = {
        time: time,
        resolution: [width, height],
        mouseLocation: [mousePos.x/width, mousePos.y/height],
        buffStartPos: megaBuffCacheUpTo,
        brushSize: brushSettings["Brush Size"],
        brushColor: brushSettings["Brush Color"],
    };


    // During frame

    runActions();

    renderWithBackground(currentBackground, writingAndDisplaying);
    splatToScreen(writingAndDisplaying);

    if (safeToCache) {
        safeToCache = false;
        [currentBackground, writingAndDisplaying] = [writingAndDisplaying, currentBackground];
        megaBuffCacheUpTo = megaBuffPos;
    }

    // Post frame
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