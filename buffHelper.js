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