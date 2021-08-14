

function bakeToDisk() {
    const scale = renderSettings.scale;
    let renderWidth = width * scale;
    let renderHeight = height * scale;
    uniformInfo.scale = 1/scale;
    uniformInfo.resolution = [renderWidth, renderHeight];
    uniformInfo.buffStartPos = 0;
    let outputArray = new Uint8ClampedArray(renderWidth * renderHeight * 4);
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