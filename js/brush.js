let lastMousePos = {x: -1, y: -1};

function createBrushUI(ui) {
    //const brushFolder = ui.addFolder('Brush')
    ui.add(brushSettings, "size", BRUSH_SIZE_MIN, BRUSH_SIZE_MAX).name("Brush Size")
    ui.add(brushSettings, "weight", 0, 5).name("Brush Weight")
    ui.add(brushSettings, "opacity", 0, 1).name("Brush Opacity")
    ui.addColor(brushSettings, "color").name("Brush Color")
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
    buffFloat(brushSettings.size);
    buffFloat(brushSettings.weight);
    buffFloat(brushSettings.opacity)
    buffFloat(brushSettings.color[0]);
    buffFloat(brushSettings.color[1]);
    buffFloat(brushSettings.color[2]);
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
            const stepDist = brushSettings.size/6;
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