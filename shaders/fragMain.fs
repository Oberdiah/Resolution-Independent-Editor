#version 300 es
precision mediump float;
precision mediump usampler2D;

// ### Modes ###
#define BRUSH_START 10
#define BRUSH_POINT 20
#define BRUSH_FINISH 30
// ### End Modes ###

uniform sampler2D u_background;
uniform usampler2D u_samp;

uniform vec2 resolution;
uniform vec2 mouseLocation;
uniform float scale;
uniform uint buffStartPos;
uniform bool queryTexture;

out vec4 colorOut;

// ### utils.fs ###

uint getBuff(uint buffLoc) {
  return texelFetch(u_samp, ivec2(buffLoc%2000u,buffLoc/2000u), 0).x;
}

int igetBuff(uint buffLoc) {
  return int(getBuff(buffLoc)) - 0x7fffffff;
}

float fgetBuff(uint buffLoc) {
  return float(igetBuff(buffLoc)) / 256.0;
}

float currentOpacity = 0.0;
float brushRadius = 50.0;
float hardness = 0.9;
vec4 brushColor = vec4(1, 1, 1, 1);

void doBrushFinish(vec2 pix, inout uint buffLoc, inout vec4 color) {
  if (brushColor.a > 0.0) {
    vec4 newCol = vec4(brushColor.rgb, brushColor.a * currentOpacity);
    color = alphaComposite(color, newCol);
  } else {
    color.a += brushColor.a * currentOpacity;
    if (color.a <= 0.0) {
      color.rgba = vec4(0);
    }
  }

  currentOpacity = 0.0;
}

void doBrushStart(vec2 pix, inout uint buffLoc, inout vec4 color) {
  brushRadius = fgetBuff(buffLoc++);
  hardness = fgetBuff(buffLoc++);
  if (hardness == 5.0) {
    hardness = 1000.0;
  }
  // A brush alpha of < 0.0 and > -1.0 means erase.
  brushColor.a = fgetBuff(buffLoc++);
  brushColor.r = fgetBuff(buffLoc++);
  brushColor.g = fgetBuff(buffLoc++);
  brushColor.b = fgetBuff(buffLoc++);
}

void doBrush(vec2 pix, inout uint buffLoc, inout vec4 color) {
  uint xCo = getBuff(buffLoc++);
  uint yCo = getBuff(buffLoc++);
  vec2 brushLoc = vec2(xCo, yCo);

  float dist = 10000.0;
  dist = length(pix - brushLoc) / brushRadius;

  if (dist < 1.0) {
    float a = currentOpacity;
    float b = easeInOutSine(1.0 - sqrt(dist))*hardness*hardness*hardness;
    currentOpacity = clamp(1.0 - (1.0 - a) * (1.0 - b), 0.0, 1.0);
  }
}

void main() {
  vec2 pix = vec2(gl_FragCoord.xy * scale);

  vec4 color = texelFetch(u_background, ivec2(gl_FragCoord.xy), 0);

  ivec2 size = textureSize(u_samp, 0);

  uint buffLoc = buffStartPos;
  while (true) {
    int val = igetBuff(buffLoc++);
    if (val == BRUSH_POINT) {
      doBrush(pix, buffLoc, color);
    } else if (val == BRUSH_FINISH) {
      doBrushFinish(pix, buffLoc, color);
    } else if (val == BRUSH_START) {
      doBrushStart(pix, buffLoc, color);
    } else {
      break;
    }
  }

  colorOut = color;
}