layout(location = 0) in vec3 vertex_position;
layout(location = 1) in vec3 vertex_normal;
layout(location = 2) in vec2 vertex_tex_coord;

layout(location = MODEL_MAT_LOCATION) uniform mat4 model_mat;
layout(location = VIEW_MAT_LOCATION) uniform mat4 view_mat;
layout(location = PROJ_MAT_LOCATION) uniform mat4 proj_mat;
layout(location = FOR_UI_LOCATION) uniform bool for_ui;
layout(location = SHADOW_VIEW_MAT_LOCATION) uniform mat4 shadow_view_mat;
layout(location = SHADOW_PROJ_MAT_LOCATION) uniform mat4 shadow_proj_mat;
layout(location = SHADOW_2_VIEW_MAT_LOCATION) uniform mat4 shadow_2_view_mat;
layout(location = SHADOW_2_PROJ_MAT_LOCATION) uniform mat4 shadow_2_proj_mat;

out vec3 frag_position;
out vec3 frag_normal;
out vec2 frag_tex_coord;
out vec4 position_from_light;
out vec4 position_from_light_2;

void main () {
    if (for_ui) {
        gl_Position = vec4(vertex_position, 1.0);
        frag_position = vec4(vertex_position, 1.0).xyz;
        frag_normal = vec3(0.0, 0.0, 1.0);
        frag_tex_coord = vertex_tex_coord;
    }
    else {
        gl_Position = proj_mat * view_mat * model_mat * vec4(vertex_position, 1.0);
        frag_position = (model_mat * vec4(vertex_position, 1.0)).xyz;
        frag_normal = normalize((inverse(transpose(model_mat)) * vec4(vertex_normal, 1.0)).xyz);
        frag_tex_coord = vertex_tex_coord;

        position_from_light = shadow_proj_mat * shadow_view_mat * vec4(frag_position, 1.0);
        position_from_light /= position_from_light.w;
        position_from_light += 1.0;
        position_from_light *= 0.5;

        position_from_light_2 = shadow_2_proj_mat * shadow_2_view_mat * vec4(frag_position, 1.0);
        position_from_light_2 /= position_from_light_2.w;
        position_from_light_2 += 1.0;
        position_from_light_2 *= 0.5;
    }
}
