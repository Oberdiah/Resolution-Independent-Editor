const fragCheckerboard = `
#version 300 es
precision mediump float;
precision mediump usampler2D;

uniform vec2 resolution;
uniform vec2 mouseLocation;
uniform float scale;
uniform float gridSize;
uniform float brushSize;
uniform vec3 brushColor;

out vec4 colorOut;

void main() {
    vec2 pix = vec2(gl_FragCoord.xy * scale);
    vec2 mouseLoc = vec2(mouseLocation * resolution);
    
    vec4 color = vec4(0);
    
//    if (mod(floor(pix / gridSize).x + floor(pix / gridSize).y, 2.0) < 1.0) {
//        color = vec4(0.1, 0.1, 0.1, 1);
//    } else {
//        color = vec4(0.0, 0.0, 0.0, 1);
//    }
    
    if (mod(pix.y + pix.x, gridSize) < gridSize/2.0) {
        color = vec4(0.1, 0.1, 0.1, 1);
    } else {
        color = vec4(0.0, 0.0, 0.0, 1);
    }

    colorOut = color;
}
`