const SIDE_LENGTH = 2000;
const BRUSH_SIZE_MIN = 1;
const BRUSH_SIZE_MAX = 200;

const megaBuff = new Uint32Array(SIDE_LENGTH * SIDE_LENGTH);
let megaBuffPos = 0;
let megaBuffCacheUpTo = 0;

let buttonsPressed = 0;
let lastButtonsPressed = 0;
let mousePos = {x: 0, y: 0};
let width = 0;
let height = 0;
let camera = {
    scale: 1,
    gridSize: 10,
};

let usingAltColor = false;

let s_brushSize = [30, "Brush Size", BRUSH_SIZE_MIN, BRUSH_SIZE_MAX]
let s_brushWeight = [1.9, "Brush Weight", 0.1, 5.0]
let s_brushOpacity = [1.0, "Brush Opacity", 0.001, 1.0]
let s_brushColor = [[1.0, 1.0, 1.0], "Brush Color"]
let s_brushAltColor = [[1.0, 1.0, 1.0], "Brush Alt Color"]
let s_renderScale = [1, "Render Scale", 1, 8]
let s_currentTool = ["Brush", "Tool", ["Brush", "Eraser", "Fill bucket", "Colour Pick"]]
let safeToCache = false;
let bakeOnNextFrame = false;
let hoveredColor = new Uint8Array(4);