#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;

    highp int bLevels= lut_tex_size.x/lut_tex_size.y;

    highp float bToLevel=color.b*float(bLevels-1);
    highp float rToLevel=color.r*(_COLORS-1.0);
    highp float gToLevel=color.g*(_COLORS-1.0);

    highp float interpB=fract(bToLevel);
    highp float interpR=fract(rToLevel);
    highp float interpG=fract(gToLevel);

    highp vec4 newColorLeft= texture(color_grading_lut_texture_sampler, vec2((floor(bToLevel)*_COLORS+0.5+floor(rToLevel))/float(lut_tex_size.x),(0.5+floor(gToLevel))/_COLORS));
    highp vec4 newColorRight= texture(color_grading_lut_texture_sampler, vec2((ceil(bToLevel)*_COLORS+0.5+ceil(rToLevel))/float(lut_tex_size.x),(0.5+ceil(gToLevel))/_COLORS));

    highp float newB=mix(newColorLeft.b,newColorRight.b,interpB);
    highp float newR=mix(newColorLeft.r,newColorRight.r,interpR);
    highp float newG=mix(newColorLeft.g,newColorRight.g,interpG);


    out_color = vec4(newR,newG,newB,1.0);
//    out_color = vec4(
//                    color.g,
//                    newTest.g,
//                    newG,
//                    newColorRight.g
//                    );
    //out_color = vec4(vec3(1.0),1.0);
}
