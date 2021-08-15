

function bakeToDisk() {
    const scale = renderSettings.scale;
    let renderWidth = width * scale;
    let renderHeight = height * scale;
    uniformInfo.scale = 1/scale;
    uniformInfo.resolution = [renderWidth, renderHeight];
    uniformInfo.buffStartPos = 0;

    renderWithBackground(
        createFramebuffer(renderWidth, renderHeight),
        createFramebuffer(renderWidth, renderHeight)
    );

    try {
        let outputArray = new Uint8ClampedArray(renderWidth * renderHeight * 4);
        gl.readPixels(0, 0, renderWidth, renderHeight, gl.RGBA, gl.UNSIGNED_BYTE, outputArray);
        let canvas = document.createElement("canvas");
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        let ctx = canvas.getContext("2d");
        ctx.putImageData(new ImageData(outputArray, renderWidth, renderHeight), 0, 0);
        ctx.translate(0, renderHeight);
        ctx.scale(1, -1);
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage(canvas, 0, 0);
        let url = canvas.toDataURL();
        downloadURL(url, "Render.png");
    } catch(err) {
        alert("Your browser is unable to render an image that large " +
            "(" + renderWidth + "x" + renderHeight + "). " +
            "Try a smaller render scale or a different browser.");
    }

}