let mainProgram;
let overlayProgram;
let checkerboardProgram;

let localFetch = '../shaders/'
let githubFetch = 'https://raw.githubusercontent.com/Oberdiah/Resolution-Independent-Editor/master/shaders/'

ImGui.default().then(() => {
    ImGui.CreateContext();
    ImGui_Impl.Init(canvas);
    grabShaders(localFetch)
})

function attemptToLoad(values, preString) {
    window.fragMain = values[0];
    window.fragOverlay = values[1];
    window.fragCheckerboard = values[2];
    window.vertMain = values[3];
    if (values[0].startsWith("#version 300 es")) {
        mainProgram = twgl.createProgramInfo(gl, [vertMain, fragMain])
        overlayProgram = twgl.createProgramInfo(gl, [vertMain, fragOverlay])
        checkerboardProgram = twgl.createProgramInfo(gl, [vertMain, fragCheckerboard])
        loadDefines();
        requestAnimationFrame(render);
    } else {
        if (preString === localFetch) {
            grabShaders(githubFetch);
        }
    }
}

function grabShaders(preString) {
    console.log("Trying " + preString);
    let allPromises = [
        fetch(preString + 'fragMain.fs').then(response => response.text()),
        fetch(preString + 'fragOverlay.fs').then(response => response.text()),
        fetch(preString + 'fragCheckerboard.fs').then(response => response.text()),
        fetch(preString + 'vertMain.vs').then(response => response.text()),
    ]
    Promise.all(allPromises).then((values) => {
        attemptToLoad(values, preString)
    })
}

