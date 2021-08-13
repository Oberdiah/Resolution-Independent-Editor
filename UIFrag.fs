#version 300 es
precision mediump float;
precision mediump usampler2D;

uniform vec2 resolution;
uniform vec2 mouseLocation;
uniform float time;
uniform float brushSize;
uniform vec3 brushColor;

uniform sampler2D u_sampleTex;
out vec4 colorOut;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 pix = vec2(gl_FragCoord.xy);
    vec2 mouseLoc = vec2(mouseLocation * resolution);

    vec4 color = texelFetch(u_sampleTex, ivec2(gl_FragCoord.xy), 0);

    float dist = length(vec2(pix - mouseLoc));
    if (dist < brushSize && dist > brushSize - 5.0) {
        color.rgb += brushColor/256.0;
    }

    colorOut = color;
}