#version 330 core
out vec3 color;

uniform sampler2D u_palette;
uniform sampler2D u_atlas;
uniform vec2 u_atlas_size;

in vec3 v_pos;
flat in vec2 v_offset;
flat in float v_light;
in float v_dist;

const float WORLD_TO_PIXEL = 100.0;
const float TILE_SIZE = 64.0;
const float DIST_SCALE = 1.0;
const float LIGHT_SCALE = 2.0;
const float LIGHT_BIAS = 1.0 / 64.0;

void main() {
    vec2 uv = mod(-v_pos.xz * WORLD_TO_PIXEL, TILE_SIZE) + v_offset;
    float palette_index = texture(u_atlas, uv / u_atlas_size).r;
    palette_index = floor(palette_index * 256.0) / 256.0 + 0.5 / 256.0;

    float dist_term = min(1.0, 1.0 - DIST_SCALE / (v_dist + DIST_SCALE));
    float light = min(v_light, v_light * LIGHT_SCALE - dist_term);
    light = 1.0 - clamp(light, LIGHT_BIAS, 1.0 - LIGHT_BIAS);
    color = texture(u_palette, vec2(palette_index, light)).rgb;
}
