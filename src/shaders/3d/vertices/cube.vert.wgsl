struct Uniforms {
  modelViewProjectionMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
  @location(0) pos: vec4<f32>,
  @location(1) color: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) pos: vec4<f32>,
  @location(0) color: vec4<f32>,
}

@vertex
fn main(input: VertexInput) ->
  VertexOutput {
  var output: VertexOutput;
  output.pos = uniforms.modelViewProjectionMatrix * input.pos;
  output.color = input.color;
  output.pos = 0.5 * (input.pos + vec4(1.0, 1.0, 1.0, 1.0));

  return output;
}

