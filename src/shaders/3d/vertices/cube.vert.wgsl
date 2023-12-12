struct Uniforms {
    modelViewProjectionMatrix : mat4x4<f32>,
};

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexInput {
  @location(0) position: vec4<f32>,
  @location(1) color: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>,
}

@vertex
fn main(input: VertexInput) ->
  VertexOutput {
  var output: VertexOutput;
  output.position = uniforms.modelViewProjectionMatrix * input.position;
  output.color = input.color;

  return output;
}

