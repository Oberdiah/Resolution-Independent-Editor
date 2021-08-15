let mainProgram;
let overlayProgram;

let localFetch = '../shaders/'
let githubFetch = 'https://raw.githubusercontent.com/Oberdiah/Resolution-Independent-Editor/master/shaders/'
let io;

ImGui.default().then(() => {
    ImGui.CreateContext();
    io = ImGui.GetIO();
    ImGui_Impl.Init(canvas);
    grabShaders(localFetch)
})

function attemptToLoad(values, preString) {
    if (values['fragMain'].startsWith("#version 300 es")) {
        for (let shaderName in values) {
            let shader = values[shaderName]
            for (let shaderName2 in values) {
                shader = shader.replaceAll("// ### " + shaderName2 + ".fs ###", values[shaderName2])
            }
            window[shaderName] = shader;
        }

        mainProgram = twgl.createProgramInfo(gl, [vertMain, fragMain])
        overlayProgram = twgl.createProgramInfo(gl, [vertMain, fragOverlay])
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
    let allShaders = ['vertMain', 'fragMain', 'fragOverlay', 'utils']

    let allPromises = allShaders.map((e) =>
        fetch(preString + e + '.fs').then(response => response.text())
    );
    Promise.all(allPromises).then((values) => {
        let map = {}
        for (let a in values) {
            map[allShaders[a]] = values[a]
        }
        attemptToLoad(map, preString)
    })
}

