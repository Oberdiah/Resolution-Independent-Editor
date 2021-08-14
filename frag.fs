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
uniform float time;
uniform float scale;
uniform uint buffStartPos;
uniform bool queryTexture;

out vec4 colorOut;

float sdSegment( in vec2 p, in vec2 a, in vec2 b ) {
  vec2 pa = p-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h );
}

float line0(vec2 p, vec2 a,vec2 b) {
  p -= a, b -= a;
  float h = dot(p, b) / dot(b, b),                  // proj coord on line
  c = clamp(h, 0., 1.);
  return h==c ? length(p - b * h) : 1e5;            // dist to strict segment
}


float opSmoothUnion( float d1, float d2, float k ) {
  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
  return mix( d2, d1, h ) - k*h*(1.0-h);
}

float easeInOutSine(float x) {
  return -(cos(3.1415 * x) - 1.0) / 2.0;
}


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

vec4 alphaComposite(vec4 under, vec4 over) {
  float alpha = over.a + under.a * (1.0 - over.a);
  vec3 col = (over.rgb * over.a + under.rgb * under.a * (1.0 - over.a))/alpha;
  return vec4(col, alpha);
}

void doBrushFinish(vec2 pix, inout uint buffLoc, inout vec4 color) {
  vec4 newCol = vec4(brushColor.rgb, brushColor.a * currentOpacity);
  color = alphaComposite(color, newCol);

  currentOpacity = 0.0;
}

void doBrushStart(vec2 pix, inout uint buffLoc, inout vec4 color) {
  brushRadius = fgetBuff(buffLoc++);
  hardness = fgetBuff(buffLoc++);
  brushColor.a = fgetBuff(buffLoc++);
  brushColor.r = fgetBuff(buffLoc++)/256.0;
  brushColor.g = fgetBuff(buffLoc++)/256.0;
  brushColor.b = fgetBuff(buffLoc++)/256.0;
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
  float gridSize = 10.0;

  if (color.a == 0.0) {
    // Checkerboard
    if (mod(floor(pix / gridSize).x + floor(pix / gridSize).y, 2.0) < 1.0) {
      color = vec4(0.1, 0.1, 0.1, 1);
    } else {
      color = vec4(0.0, 0.0, 0.0, 1);
    }
  }

  // Stripes
//  if (mod(pix.y + pix.x, gridSize) < gridSize/2.0) {
//    color = vec4(0.1, 0.1, 0.1, 1);
//  }

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