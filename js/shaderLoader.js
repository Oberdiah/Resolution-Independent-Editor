let mainProgram;
let overlayProgram;
let checkerboardProgram;

allPromises = [
    fetch('../shaders/fragMain.mjs').then(response => response.text()),
    fetch('../shaders/fragOverlay.mjs').then(response => response.text()),
    fetch('../shaders/fragCheckerboard.mjs').then(response => response.text()),
    fetch('../shaders/vertMain.mjs').then(response => response.text()),
]

Promise.all(allPromises).then((values) => {
    window.fragMain = values[0];
    window.fragOverlay = values[1];
    window.fragCheckerboard = values[2];
    window.vertMain = values[3];
    mainProgram = twgl.createProgramInfo(gl, [vertMain, fragMain])
    overlayProgram = twgl.createProgramInfo(gl, [vertMain, fragOverlay])
    checkerboardProgram = twgl.createProgramInfo(gl, [vertMain, fragCheckerboard])
    loadDefines();
    requestAnimationFrame(render);
})
