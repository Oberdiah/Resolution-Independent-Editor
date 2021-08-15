let mainProgram;
let overlayProgram;
let checkerboardProgram;

let localFetch = '../shaders/'
let githubFetch = 'https://raw.githubusercontent.com/Oberdiah/Resolution-Independent-Editor/master/shaders/'

grabShaders(localFetch)

function attemptToLoad(values, preString) {
    window.fragMain = values[0];
    window.fragOverlay = values[1];
    window.fragCheckerboard = values[2];
    window.vertMain = values[3];
    if (values[0] !== '') {
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
        fetch(preString + 'fragMain.mjs').then(response => response.text()),
        fetch(preString + 'fragOverlay.mjs').then(response => response.text()),
        fetch(preString + 'fragCheckerboard.mjs').then(response => response.text()),
        fetch(preString + 'vertMain.mjs').then(response => response.text()),
    ]
    Promise.all(allPromises).then((values) => {
        attemptToLoad(values, preString)
    })
}

