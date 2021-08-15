#version 300 es
precision mediump float;
precision mediump usampler2D;

uniform vec2 resolution;
uniform vec2 mouseLocation;
uniform float scale;
uniform float brushSize;
uniform vec3 brushColor;
uniform float gridSize;

uniform sampler2D u_sampleTex;
out vec4 colorOut;

vec3 pow2(vec3 a) {
    return a * a;
}

vec4 alphaComposite(vec4 under, vec4 over) {
    if (over.a == 0.0) {
        return under;
    }
    float alpha = over.a + under.a * (1.0 - over.a);
    // From Minute Physics - https://www.youtube.com/watch?v=LKnqECcg6Gw
    //vec3 col = sqrt((pow2(over.rgb) * over.a + pow2(under.rgb) * under.a * (1.0 - over.a))/alpha);
    vec3 col = ((over.rgb) * over.a + (under.rgb) * under.a * (1.0 - over.a))/alpha;
    return vec4(col, alpha);
}

void main() {
    vec2 pix = vec2(gl_FragCoord.xy * scale);
    vec2 mouseLoc = vec2(mouseLocation * resolution);

    vec4 color = vec4(0);
//    if (mod(pix.y + pix.x, gridSize) < gridSize/2.0) {
//        color = vec4(0.1, 0.1, 0.1, 1);
//    } else {
//        color = vec4(0.0, 0.0, 0.0, 1);
//    }

    if (mod(floor(pix / gridSize).x + floor(pix / gridSize).y, 2.0) < 1.0) {
        color = vec4(0.1, 0.1, 0.1, 1);
    } else {
        color = vec4(0.0, 0.0, 0.0, 1);
    }

    color = alphaComposite(color, texelFetch(u_sampleTex, ivec2(gl_FragCoord.xy), 0));
    color.a = 1.0;

    float dist = length(vec2(pix - mouseLoc));

    if (dist < brushSize && dist > brushSize - 5.0) {
        // Invert the color.
        color.rgb *= -1.0;
        color.rgb += 1.0;
    }

    colorOut = color;
}