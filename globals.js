let mouseDown = false;
let mouseWasDown = false;
let mousePos = {x: 0, y: 0};

const SIDE_LENGTH = 2000;

const megaBuf = new Uint32Array(SIDE_LENGTH * SIDE_LENGTH);
let megaBufPos = 0;