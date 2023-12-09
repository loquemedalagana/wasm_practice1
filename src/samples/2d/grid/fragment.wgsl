struct FragInput {
  @location(0) cell: vec2f,
}

struct FragOutput {
  @location(0) cell: vec4f,
}

@fragment
fn main(input: FragInput) -> FragOutput {
  var output: FragOutput;
  output.cell = vec4f(input.cell, 0, 1);
  return output;
}