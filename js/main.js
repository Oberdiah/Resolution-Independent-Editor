const gui = new dat.GUI({name: "Cool Editor"});
createBrushUI(gui);
gui.add(camera, "scale", 0.1, 1.0).name("Camera Scale");
gui.add(camera, "gridSize", 5.0, 50.0, 5.0).name("Grid Size");
gui.add(renderSettings, "scale", 1, 10, 1).name("Render Scale");
gui.add({Render: () => {
        bakeOnNextFrame = true;
    }}, "Render");

const canvas = document.getElementById('canvasgl');
const gl = twgl.getContext(canvas, { depth: false, antialiasing: false });

const mainProgram = twgl.createProgramInfo(gl, [vertMain, fragMain]);
const overlayProgram = twgl.createProgramInfo(gl, [vertMain, fragOverlay]);
const checkerboardProgram = twgl.createProgramInfo(gl, [vertMain, fragCheckerboard]);

const windowVertArray = twgl.createBufferInfoFromArrays(gl, {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
});

const megaBufOptions = {
    width: SIDE_LENGTH,
    height: SIDE_LENGTH,
    internalFormat: gl.R32UI,
};

const megaBufTex = twgl.createTexture(gl, megaBufOptions);

function clearCache() {
    megaBuffCacheUpTo = 0;
    twgl.setEmptyTexture(gl, currentBackground.attachments[0], {width: width, height: height});
    refreshUniforms();
    renderCheckerboard(currentBackground);

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

function refreshUniforms() {
    uniformInfo = {
        resolution: [width, height],
        mouseLocation: [mousePos.x/width, mousePos.y/height],
        buffStartPos: megaBuffCacheUpTo,
        brushSize: brushSettings.size,
        brushColor: brushSettings.color,
        scale: camera.scale,
        gridSize: camera.gridSize,
    };
}

var myIFrame = document.getElementById("test.gg");
var content = myIFrame.contentWindow.document.body.innerHTML;
console.log(content);

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

    if (uniformInfo.scale !== camera.scale || uniformInfo.gridSize !== camera.gridSize) {
        clearCache();
    }

    refreshUniforms();

    // During frame

    brush();

    renderWithBackground(currentBackground, writingAndDisplaying);

    gl.readPixels(mousePos.x, mousePos.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, hoveredColor);

    splatToScreen(writingAndDisplaying);

    if (bakeOnNextFrame) {
        bakeOnNextFrame = false;
        bakeToDisk();
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

requestAnimationFrame(render);