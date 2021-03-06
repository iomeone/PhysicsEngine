in vec3 frag_position;
in vec3 frag_normal;
in vec2 frag_tex_coord;
in vec4 position_from_light;
in vec4 position_from_light_2;

layout(location = DRAW_SHADOWS_LOCATION) uniform bool draw_shadows;
layout(location = AMBIENT_LOCATION) uniform vec3 ambient;
layout(location = DIFFUSE_LOCATION) uniform vec3 diffuse;
layout(location = SPECULAR_LOCATION) uniform vec3 specular;
layout(location = SHININESS_LOCATION) uniform float shininess;
layout(location = SINGLE_COLOR_LOCATION) uniform bool single_color;
layout(location = FOR_SHADOW_LOCATION) uniform bool for_shadow;
layout(location = ONLY_TEXTURE_LOCATION) uniform bool only_texture;

layout(binding = 0) uniform sampler2D diffuse_map;
layout(binding = 1) uniform sampler2D shadow_depth_map;
layout(binding = 2) uniform sampler2D shadow_2_depth_map;

out vec4 color;

void main () {
    if (for_shadow) {
    }
    else if (single_color) {
        color = vec4(diffuse, 1.0);
    }
    else if (only_texture) {
        color = vec4(texture(diffuse_map, frag_tex_coord).r, 0.0, 0.0, 1.0);
    }
    else {
        float bias = 0.01;
        float shadow = 0.0;

        if (position_from_light.x >= 0 && position_from_light.x <= 1
                && position_from_light.y >= 0 && position_from_light.y <= 1) {
            vec2 texel_size = 1.0 / textureSize(shadow_depth_map, 0);

            for(int x = -1; x <= 1; x++) {
                for(int y = -1; y <= 1; y++) {
                    float pcf_depth = texture(shadow_depth_map, position_from_light.xy + vec2(x, y) * texel_size).r; 
                    shadow += position_from_light.z - bias > pcf_depth ? 0.8 : 0.0;        
                }
            }

            shadow /= 9.0;
        }
        else if (position_from_light_2.x >= 0 && position_from_light_2.x <= 1
                && position_from_light_2.y >= 0 && position_from_light_2.y <= 1) {
            vec2 texel_size = 1.0 / textureSize(shadow_2_depth_map, 0);

            for(int x = -1; x <= 1; x++) {
                for(int y = -1; y <= 1; y++) {
                    float pcf_depth = texture(shadow_2_depth_map, position_from_light_2.xy + vec2(x, y) * texel_size).r; 
                    shadow += position_from_light_2.z - bias > pcf_depth ? 0.8 : 0.0;        
                }
            }

            shadow /= 9.0;
        }
        else {
            shadow = 0.0;
        }

        vec3 light_direction1 = normalize(vec3(1.5, -1.2, 0.8));
        vec3 light_direction2 = normalize(vec3(-1.2, 0.9, -1.5));
        vec3 light_direction3 = normalize(vec3(0.5, -1.1, -1.8));
        vec3 light_direction4 = normalize(vec3(-0.5, 1.2, 1.5));

        float kd = (1.0 - shadow) * max(0.2, dot(normalize(vec3(0.0, 10.0, 10.0) - frag_position), frag_normal));
        kd += 0.1 * max(dot(light_direction1, frag_normal), 0.3);
        kd += 0.1 * max(dot(light_direction2, frag_normal), 0.3);
        kd += 0.1 * max(dot(light_direction3, frag_normal), 0.3);
        kd += 0.1 * max(dot(light_direction4, frag_normal), 0.3);

        vec3 diffuse_color = 0.9 * kd * texture(diffuse_map, frag_tex_coord).rgb;
        vec3 ambient_color = 0.1 * ambient;

        color = vec4(diffuse_color + ambient_color, 1.0);
    }
}
