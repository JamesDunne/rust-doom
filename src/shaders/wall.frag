#version 330 core
out vec3 color;

uniform vec2 u_atlas_size;
uniform sampler2D u_atlas;
uniform sampler2D u_palette;

in float v_dist;
in vec2 v_tile_uv;
flat in vec2 v_atlas_uv;
flat in float v_tile_width;
flat in float v_light;

const float TILE_HEIGHT = 128.0;
const float DIST_SCALE = 1.0;
const float LIGHT_SCALE = 2.0;
const float LIGHT_BIAS = 1.0 / 64.0;

void main() {
    vec2 uv = mod(v_tile_uv, vec2(v_tile_width, TILE_HEIGHT)) + v_atlas_uv;
    vec2 palette_index = texture(u_atlas, uv / u_atlas_size).rg;
    palette_index = floor(palette_index * 256.0) / 256.0 + 0.5 / 256.0;
    if (palette_index.g > .5) {  // Transparent pixel.
        discard;
    } else {
        float dist_term = min(1.0, 1.0 - DIST_SCALE / (v_dist + DIST_SCALE));
        float light = min(v_light, v_light * LIGHT_SCALE - dist_term);
        light = clamp(1.0 - light, LIGHT_BIAS, 1.0 - LIGHT_BIAS);
        color = texture(u_palette, vec2(palette_index.r, light)).rgb;
    }
}
