function buffPos(pos) {
    megaBuff[megaBuffPos++] = pos.x;
    megaBuff[megaBuffPos++] = pos.y;
}

function buffUInt(i) {
    megaBuff[megaBuffPos++] = i;
}

function buffInt(i) {
    megaBuff[megaBuffPos++] = i+0x7fffffff;
}

function buffFloat(f) {
    buffInt(f*256);
}

function sneakBuffPos(pos) {
    megaBuff[megaBuffPos] = pos.x;
    megaBuff[megaBuffPos+1] = pos.y;
}

function sneakBuffUInt(i) {
    megaBuff[megaBuffPos] = i;
}

function sneakBuffInt(i) {
    megaBuff[megaBuffPos] = i+0x7fffffff;
}

function sneakBuffFloat(f) {
    sneakBuffInt(f*256);
}

function buffColor(color, invert = false) {
    buffFloat(color[0]);
    buffFloat(color[1]);
    buffFloat(color[2]);
    buffFloat(invert ? -color[3] : color[3]);
}

function buffBrushColor() {
    if (buttonsPressed === 1) {
        buffColor(s_brushColor[0], getCurrentTool() === TOOL_ERASER)
    } else {
        buffColor(s_brushAltColor[0], getCurrentTool() === TOOL_ERASER)
    }
}