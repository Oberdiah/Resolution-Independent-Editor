let allShaders = {
    "fragCheckerboard": false,
    "fragMain": false,
};

function testIfFinished(a, content) {
    allShaders[a] = true;
    console.log(content);

    let done = true;
    for (let f in allShaders) {
        if (!allShaders[f]) {
            done = false;
        }
    }
    if (done) {
        console.log("Finished loading ...");
        requestAnimationFrame(render);
    }
}

for (let a in allShaders) {
    let myIFrame = document.getElementById(a);
    myIFrame.addEventListener("load", function() {
        let content = myIFrame.contentWindow.document.body.innerHTML;
        content = content.substr(5, content.length - 11);
        testIfFinished(a, content);
    });
}
