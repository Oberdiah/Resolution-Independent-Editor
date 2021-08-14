let lastMousePos = {x: -1, y: -1};
let brushSettings = {
    "Brush Size": 30,
    "Brush Weight": 1.9,
    "Brush Opacity": 1.0,
    "Brush Color": [255, 255, 255],
};

function createBrushUI(ui) {
    //const brushFolder = ui.addFolder('Brush')
    ui.add(brushSettings, "Brush Size", 1, 100)
    ui.add(brushSettings, "Brush Weight", 0, 10)
    ui.add(brushSettings, "Brush Opacity", 0, 1)
    ui.addColor(brushSettings, "Brush Color")
}

function buffBrushPoint(pos) {
    buffInt(BRUSH_POINT);
    buffPos(pos);
}

function buffBrushFinish() {
    buffInt(BRUSH_FINISH);
}

function buffBrushStart() {
    buffInt(BRUSH_START);
    buffFloat(brushSettings["Brush Size"]);
    buffFloat(brushSettings["Brush Weight"]);
    buffFloat(brushSettings["Brush Opacity"]);
    buffFloat(brushSettings["Brush Color"][0]);
    buffFloat(brushSettings["Brush Color"][1]);
    buffFloat(brushSettings["Brush Color"][2]);
}

function brush() {
    // Mouse down
    if (mouseDown && !mouseWasDown) {
        buffBrushStart();
    }

    // Drag
    if (mouseDown) {
        if (lastMousePos.x === -1) {
            for (let i = 0; i < 2; i++) {
                buffBrushPoint(mousePos);
            }
            sneakBuffInt(BRUSH_FINISH); // Sneakily add an end on the end
            setTo(lastMousePos, mousePos);
        } else {
            let distBetween = dist(mousePos, lastMousePos);
            const stepDist = brushSettings["Brush Size"]/6;
            let step = mul(normalize(subtract(mousePos, lastMousePos)), stepDist);
            while (distBetween > stepDist) {
                lastMousePos = add(lastMousePos, step);
                distBetween -= stepDist;
                buffBrushPoint(lastMousePos);
                sneakBuffInt(BRUSH_FINISH); // Sneakily add an end on the end
            }
        }
    }

    // Mouse up
    if (!mouseDown && mouseWasDown) {
        buffBrushFinish();
        lastMousePos.x = -1;
        safeToCache = true;
    }
}