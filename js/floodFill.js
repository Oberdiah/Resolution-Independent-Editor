function floodFill() {
    if (getCurrentTool() !== TOOL_FLOOD_FILL) {
        return;
    }

    if (buttonsPressed !== 0 && lastButtonsPressed === 0) {
        buffInt(FLOOD_FILL);
        buffBrushColor()
        buffColor(s_hoveredColor[0])
    }
}