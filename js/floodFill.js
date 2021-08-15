function floodFill() {
    if (getCurrentTool() !== TOOL_FLOOD_FILL) {
        return;
    }

    if (buttonsPressed !== 0 && lastButtonsPressed === 0) {
        buffInt(FLOOD_FILL);
        // TODO make brush and eraser separate and combine the opacity into the brush itself
        buffBrushColor()
        buffFloat(s_brushOpacity[0])
        buffColor(s_hoveredColor[0])
        buffFloat(s_hoveredColor[0][3]) // Opacity
    }
}