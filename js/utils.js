function download(content, filename, contentType) {
    if(!contentType) contentType = 'application/octet-stream';
    let blob = new Blob([content], {'type':contentType});
    downloadURL(window.URL.createObjectURL(blob), filename)
}

function downloadURL(url, filename) {
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function size(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function subtract(a, b) {
    return {x: a.x - b.x, y: a.y - b.y};
}
function add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y};
}
function mul(a, d) {
    return {x: a.x * d, y: a.y * d};
}

function setTo(a, b) {
    a.x = b.x;
    a.y = b.y;
}

function normalize(a) {
    let len = size(a);
    if (len === 0) {
        return {x: 0, y:0};
    }
    return mul(a, 1/len);
}

function loadDefines() {
    const startText = "// ### Modes ###";
    const endText = "// ### End Modes ###";

    const start = fragMain.indexOf(startText) + startText.length;
    const end = fragMain.indexOf(endText);
    const split = fragMain.slice(start, end).split("\n");

    for (const s in split) {
        const str = split[s];
        if (str.includes("#define")) {
            const values = str.split(" ").slice(1, 3);
            window[values[0]] = parseInt(values[1]);
        }
    }
}

// megaBuf[megaBufPos++] = 10;
// megaBuf[megaBufPos++] = 50;
// megaBuf[megaBufPos++] = 50;
// megaBuf[megaBufPos++] = 10;
// megaBuf[megaBufPos++] = 90;
// megaBuf[megaBufPos++] = 700;
// megaBuf[megaBufPos++] = 10;
// megaBuf[megaBufPos++] = 200;
// megaBuf[megaBufPos++] = 250;
// megaBuf[megaBufPos++] = 10;
// megaBuf[megaBufPos++] = 300;
// megaBuf[megaBufPos++] = 500;
// megaBuf[megaBufPos++] = 20;