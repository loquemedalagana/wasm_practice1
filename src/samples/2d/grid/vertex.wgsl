struct VertexInput {
  @location(0) pos: vec2f,
  @builtin(instance_index) instance: u32,
}

struct VertexOutput {
  @builtin(position) pos: vec4f,
  @location(0) cell: vec2f,
}

@group(0) @binding(0) var<uniform> grid: vec2f;

@vertex
fn main(input: VertexInput) ->
  VertexOutput {

  let i = f32(input.instance); // save the instance_index as a float
  let cell = vec2f(i % grid.x, floor(i / grid.x)); // Cell(i,i) in the image above
  let cellOffset = cell / grid * 2; // Compute the offset to cell
  let gridPos = (input.pos + 1) / grid - 1 + cellOffset; // Add it here!

  var output: VertexOutput;
  output.pos = vec4f(gridPos, 0, 1);
  output.cell = cell;
  return output;
}