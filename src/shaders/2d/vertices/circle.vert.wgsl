@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  let theta = f32(VertexIndex) / 32.0 * (3.14159 * 2);
  let x = 0.5 * cos(theta);
  let y = 0.5 * sin(theta);

  return vec4<f32>(x, y, 0.0, 1.0);
}