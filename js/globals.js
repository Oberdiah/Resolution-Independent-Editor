let mouseDown = false;
let mouseWasDown = false;
let mousePos = {x: 0, y: 0};
let width = 0;
let height = 0;
let camera = {
    Scale: 1,
};
let renderSettings = {
    "Render Scale": 1,
}
let safeToCache = false;
let renderOnNextFrame = false;
let hoveredColor = {r: 0, g: 0, b: 0, a: 0};

const SIDE_LENGTH = 2000;

const megaBuff = new Uint32Array(SIDE_LENGTH * SIDE_LENGTH);
let megaBuffPos = 0;
let megaBuffCacheUpTo = 0;