struct VertexOutput {
  @builtin(position) pos: vec4<f32>,
  @location(0) color: vec4<f32>,
}

@fragment
fn main(
  vertexOutput: VertexOutput,
) -> @location(0) vec4<f32> {
   return vertexOutput.color; // color
}