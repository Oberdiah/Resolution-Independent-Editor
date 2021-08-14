import * as twgl from '/twgl-full.module.js';
import * as dat from '/dat.gui.module.js';

const gui = new dat.GUI({name: "Cool Editor"});
createBrushUI(gui);
gui.add({Render: () => {
    renderOnNextFrame = true;
}}, "Render");
gui.add(camera, "Scale", 0.1, 1.0);
gui.add(renderSettings, "Render Scale", 1, 10, 1);

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

function createFramebuffer(width, height) {
    if (width === undefined) width = gl.canvas.width;
    if (height === undefined) height = gl.canvas.height;
    return twgl.createFramebufferInfo(gl, [{attachment: twgl.createTexture(gl, {
            width: width,
            height: height,
            minMag: gl.NEAREST,
            maxLevel: 0,
        })}], width, height);
}

const megaBufTex = twgl.createTexture(gl, megaBufOptions);

function colorPick() {
    let tempArr = new Uint8Array(4);
    gl.readPixels(mousePos.x, mousePos.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, tempArr);
    hoveredColor.r = tempArr[0];
    hoveredColor.g = tempArr[1];
    hoveredColor.b = tempArr[2];
    hoveredColor.a = tempArr[3];
}

function renderWithBackground(background, writeTo) {
    gl.viewport(0, 0, uniformInfo.resolution[0], uniformInfo.resolution[1]);
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
    gl.viewport(0, 0, uniformInfo.resolution[0], uniformInfo.resolution[1]);
    gl.useProgram(programInfoSimpleFrag.program);
    twgl.setUniformsAndBindTextures(programInfoSimpleFrag, uniformInfo);

    twgl.setUniformsAndBindTextures(programInfoSimpleFrag, {
        u_sampleTex: framebuffer.attachments[0],
    });
    twgl.bindFramebufferInfo(gl, null);
    twgl.drawBufferInfo(gl, windowVertArray);
}

function clearCache() {
    megaBuffCacheUpTo = 0;
    twgl.setEmptyTexture(gl, currentBackground.attachments[0], {width: width, height: height});
    // Note to self, could be dangerous
    // Longer term, should render up to whatever megaBuffCacheUpTo used to be
    // after a cache clear, rather than to the present as this is doing.
    safeToCache = true;
}

const interRenderFB1 = createFramebuffer();
const interRenderFB2 = createFramebuffer();
const interRenderFB3 = createFramebuffer();

let currentBackground = interRenderFB1;
let writingAndDisplaying = interRenderFB2;
let uniformInfo = {};

function render(time) {
    // Pre frame
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    if (width !== gl.canvas.width || height !== gl.canvas.height) {
        width = gl.canvas.width;
        height = gl.canvas.height;
        twgl.resizeFramebufferInfo(gl, interRenderFB1, interRenderFB1.attachments, width, height);
        twgl.resizeFramebufferInfo(gl, interRenderFB2, interRenderFB2.attachments, width, height);
        twgl.resizeFramebufferInfo(gl, interRenderFB3, interRenderFB3.attachments, width, height);
        clearCache();
    }

    if (uniformInfo.scale !== camera["Scale"]) {
        clearCache();
    }
    uniformInfo = {
        time: time,
        resolution: [width, height],
        mouseLocation: [mousePos.x/width, mousePos.y/height],
        buffStartPos: megaBuffCacheUpTo,
        brushSize: brushSettings["Brush Size"],
        brushColor: brushSettings["Brush Color"],
        scale: camera["Scale"],
    };

    // During frame

    runActions();

    renderWithBackground(currentBackground, writingAndDisplaying);
    colorPick();
    splatToScreen(writingAndDisplaying);

    if (renderOnNextFrame) {
        renderOnNextFrame = false;
        const scale = renderSettings["Render Scale"];
        let renderWidth = width * scale;
        let renderHeight = height * scale;
        let outputArray = new Uint8ClampedArray(renderWidth * renderHeight * 4);
        uniformInfo.scale = 1/scale;
        uniformInfo.resolution = [renderWidth, renderHeight];
        uniformInfo.buffStartPos = 0;
        renderWithBackground(
            createFramebuffer(renderWidth, renderHeight),
            createFramebuffer(renderWidth, renderHeight)
        );
        gl.readPixels(0, 0, renderWidth, renderHeight, gl.RGBA, gl.UNSIGNED_BYTE, outputArray);
        let canvas = document.createElement("canvas");
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        let img = new ImageData(outputArray, renderWidth, renderHeight);
        canvas.getContext("2d").putImageData(img, 1, 1);
        let url = canvas.toDataURL();
        downloadURL(url, "Render.png");
    }

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
    mousePos.x = e.clientX * camera.Scale;
    mousePos.y = (gl.canvas.clientHeight - e.clientY) * camera.Scale;
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