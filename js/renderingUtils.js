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

function renderCheckerboard(writeTo) {
    gl.viewport(0, 0, uniformInfo.resolution[0], uniformInfo.resolution[1]);
    gl.useProgram(checkerboardProgram.program);
    twgl.setUniformsAndBindTextures(checkerboardProgram, uniformInfo);
    twgl.setBuffersAndAttributes(gl, checkerboardProgram, windowVertArray);
    twgl.bindFramebufferInfo(gl, writeTo);
    twgl.drawBufferInfo(gl, windowVertArray);
}

function renderWithBackground(background, writeTo) {
    gl.viewport(0, 0, uniformInfo.resolution[0], uniformInfo.resolution[1]);
    gl.useProgram(mainProgram.program);
    twgl.setUniformsAndBindTextures(mainProgram, uniformInfo);

    twgl.setTextureFromArray(gl, megaBufTex, megaBuff, megaBufOptions)
    twgl.setBuffersAndAttributes(gl, mainProgram, windowVertArray);
    twgl.setUniformsAndBindTextures(mainProgram, {
        u_samp: megaBufTex,
        u_background: background.attachments[0],
    });
    twgl.bindFramebufferInfo(gl, writeTo);
    twgl.drawBufferInfo(gl, windowVertArray);
}

function splatToScreen(framebuffer) {
    gl.viewport(0, 0, uniformInfo.resolution[0], uniformInfo.resolution[1]);
    gl.useProgram(overlayProgram.program);
    twgl.setUniformsAndBindTextures(overlayProgram, uniformInfo);

    twgl.setUniformsAndBindTextures(overlayProgram, {
        u_sampleTex: framebuffer.attachments[0],
    });
    twgl.bindFramebufferInfo(gl, null);
    twgl.drawBufferInfo(gl, windowVertArray);
}