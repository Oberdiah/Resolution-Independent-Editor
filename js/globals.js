const SIDE_LENGTH = 2000;
const megaBuff = new Uint32Array(SIDE_LENGTH * SIDE_LENGTH);
let megaBuffPos = 0;
let megaBuffCacheUpTo = 0;

let mouseDown = false;
let mouseWasDown = false;
let mousePos = {x: 0, y: 0};
let width = 0;
let height = 0;
let camera = {
    scale: 1,
    gridSize: 10,
};
let renderSettings = {
    scale: 1,
}
let brushSettings = {
    size: 30,
    weight: 1.9,
    opacity: 1.0,
    color: [255, 255, 255],
};
let safeToCache = false;
let bakeOnNextFrame = false;
let hoveredColor = new Uint8Array(4);