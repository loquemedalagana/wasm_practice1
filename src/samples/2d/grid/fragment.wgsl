struct FragInput { // the same as vertex input
  @location(0) cell: vec2f,
}

struct FragOutput {
  @location(0) cell: vec4f,
}

@group(0) @binding(0) var<uniform> grid: vec2f;

@fragment
fn main(input: FragInput) -> FragOutput {
  let c = input.cell / grid;
  var output: FragOutput;
  output.cell = vec4f(c, 1 - c.x, 1);
  return output;
}