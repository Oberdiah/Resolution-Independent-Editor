function colorPick() {
    if (getCurrentTool() !== TOOL_COLOR_PICK) {
        return;
    }
    if (buttonsPressed !== 0 && lastButtonsPressed === 0) {
        if (buttonsPressed === 1) {
            s_brushColor[0][0] = s_hoveredColor[0][0]
            s_brushColor[0][1] = s_hoveredColor[0][1]
            s_brushColor[0][2] = s_hoveredColor[0][2]
        } else {
            s_brushAltColor[0][0] = s_hoveredColor[0][0]
            s_brushAltColor[0][1] = s_hoveredColor[0][1]
            s_brushAltColor[0][2] = s_hoveredColor[0][2]
        }
    }
}