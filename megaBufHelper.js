function buffPos(pos) {
    megaBuf[megaBufPos++] = pos.x;
    megaBuf[megaBufPos++] = pos.y;
}

function buffUInt(i) {
    megaBuf[megaBufPos++] = i;
}

function buffInt(i) {
    megaBuf[megaBufPos++] = i+0x7fffffff;
}

function buffFloat(f) {
    buffInt(f*256);
}