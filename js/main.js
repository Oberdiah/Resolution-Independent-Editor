const canvas = document.getElementById('canvasgl');
const gl = twgl.getContext(canvas, { depth: false, antialiasing: false });

const windowVertArray = twgl.createBufferInfoFromArrays(gl, {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
});

const megaBufOptions = {
    width: SIDE_LENGTH,
    height: SIDE_LENGTH,
    internalFormat: gl.R32UI,
};

const megaBufTex = twgl.createTexture(gl, megaBufOptions);

function updateHoveredColor() {
    let hoveredArr = new Uint8Array(4);
    gl.readPixels(mousePos.x, mousePos.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, hoveredArr);
    s_hoveredColor[0][0] = hoveredArr[0]/256.0
    s_hoveredColor[0][1] = hoveredArr[1]/256.0
    s_hoveredColor[0][2] = hoveredArr[2]/256.0
    s_hoveredColor[0][3] = hoveredArr[3]/256.0
}

function clearCache() {
    megaBuffCacheUpTo = 0;
    twgl.setEmptyTexture(gl, currentCache.attachments[0], {width: width, height: height});
    refreshUniforms();

    // Note to self, could be dangerous
    // Longer term, should render up to whatever megaBuffCacheUpTo used to be
    // after a cache clear, rather than to the present as this is doing.
    safeToCache = true;
}

const interRenderFB1 = createFramebuffer();
const interRenderFB2 = createFramebuffer();
const interRenderFB3 = createFramebuffer();

let currentCache = interRenderFB1;
let writingAndDisplaying = interRenderFB2;
let uniformInfo = {};

function refreshUniforms() {
    uniformInfo = {
        resolution: [width, height],
        mouseLocation: [mousePos.x/width, mousePos.y/height],
        buffStartPos: megaBuffCacheUpTo,
        brushSize: s_brushSize[0],
        brushColor: s_brushColor[0],
        scale: camera.scale,
        gridSize: camera.gridSize,
        currentTool: getCurrentTool(),
    };
}

function render(time) {
    // // Pre frame
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
    floodFill();
    colorPick();

    renderWithBackground(currentCache, writingAndDisplaying);

    updateHoveredColor()

    splatToScreen(writingAndDisplaying);

    if (bakeOnNextFrame) {
        bakeOnNextFrame = false;
        bakeToDisk();
    }

    if (safeToCache) {
        safeToCache = false;
        [currentCache, writingAndDisplaying] = [writingAndDisplaying, currentCache];
        megaBuffCacheUpTo = megaBuffPos;
    }

    // Imgui

    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();
    renderImGUI();
    ImGui.EndFrame();
    ImGui.Render();
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    // Post frame

    lastButtonsPressed = buttonsPressed;

    requestAnimationFrame(render);
}