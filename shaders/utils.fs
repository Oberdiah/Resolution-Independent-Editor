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

vec3 pow2(vec3 a) {
    return a * a;
}

vec4 alphaComposite(vec4 under, vec4 over) {
    if (over.a == 0.0) {
        return under;
    }
    float alpha = over.a + under.a * (1.0 - over.a);
    // From Minute Physics - https://www.youtube.com/watch?v=LKnqECcg6Gw
    vec3 col = sqrt((pow2(over.rgb) * over.a + pow2(under.rgb) * under.a * (1.0 - over.a))/alpha);
    return vec4(col, alpha);
}

vec4 alphaCompositeTraditional(vec4 under, vec4 over) {
    if (over.a == 0.0) {
        return under;
    }
    float alpha = over.a + under.a * (1.0 - over.a);
    vec3 col = ((over.rgb) * over.a + (under.rgb) * under.a * (1.0 - over.a))/alpha;
    return vec4(col, alpha);
}