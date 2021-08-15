// This is absolute insanity, but it's insanity that works.
let mainProgram;
let overlayProgram;
let checkerboardProgram;

let allShaders = {
    "fragCheckerboard": false,
    "fragMain": false,
    "fragOverlay": false,
    "vertMain": false,
};

function testIfFinished(a, content) {
    allShaders[a] = true;
    window[a] = content;

    let done = true;
    for (let f in allShaders) {
        if (!allShaders[f]) {
            done = false;
        }
    }
    if (done) {
        console.log("Finished loading ...");
        mainProgram = twgl.createProgramInfo(gl, [vertMain, fragMain])
        overlayProgram = twgl.createProgramInfo(gl, [vertMain, fragOverlay])
        checkerboardProgram = twgl.createProgramInfo(gl, [vertMain, fragCheckerboard])
        loadDefines();
        requestAnimationFrame(render);
    }
}

for (let a in allShaders) {
    let myIFrame = document.getElementById(a);
    myIFrame.addEventListener("load", function() {
        let content = myIFrame.contentWindow.document.body
            .getElementsByTagName( 'pre' )[0]
            .innerHTML;
        content = content.replaceAll("&lt;", "<");
        content = content.replaceAll("&gt;", ">");
        content = content.replaceAll("&amp;", "&");
        testIfFinished(a, content);
    });
}
