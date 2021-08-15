let lastMousePos = {x: -1, y: -1};

function buffBrushPoint(pos) {
    buffInt(BRUSH_POINT);
    buffPos(pos);
}

function buffBrushFinish() {
    buffInt(BRUSH_FINISH);
}

function buffBrushStart(useAltColor) {
    buffInt(BRUSH_START);
    buffFloat(s_brushSize[0]);
    buffFloat(s_brushWeight[0]);
    if (s_currentTool[0] === "Brush") {
        buffFloat(s_brushOpacity[0]);
    } else if (s_currentTool[0] === "Eraser") {
        buffFloat(-s_brushOpacity[0]);
    }
    if (!useAltColor) {
        buffFloat(s_brushColor[0][0]);
        buffFloat(s_brushColor[0][1]);
        buffFloat(s_brushColor[0][2]);
    } else {
        buffFloat(s_brushAltColor[0][0]);
        buffFloat(s_brushAltColor[0][1]);
        buffFloat(s_brushAltColor[0][2]);
    }
}

function brush() {
    // Mouse down
    if (buttonsPressed !== 0 && lastButtonsPressed === 0) {
        buffBrushStart(buttonsPressed === 2);
    }

    // Drag
    if (buttonsPressed !== 0) {
        if (lastMousePos.x === -1) {
            for (let i = 0; i < 2; i++) {
                buffBrushPoint(mousePos);
            }
            sneakBuffInt(BRUSH_FINISH); // Sneakily add an end on the end
            setTo(lastMousePos, mousePos);
        } else {
            let distBetween = dist(mousePos, lastMousePos);
            const stepDist = s_brushSize[0]/6;
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
    if (buttonsPressed === 0 && lastButtonsPressed !== 0) {
        buffBrushFinish();
        lastMousePos.x = -1;
        safeToCache = true;
    }
}