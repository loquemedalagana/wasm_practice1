@group(0) @binding(0) var<uniform> grid: vec2f;

@vertex
fn main(@location(0) pos: vec2f,
        @builtin(instance_index) instance: u32) ->
  @builtin(position) vec4f {

  let i = f32(instance); // save the instance_index as a float
  let cell = vec2f(i, i); // Cell(i,i) in the image above
  let cellOffset = cell / grid * 2; // Compute the offset to cell
  let gridPos = (pos + 1) / grid - 1 + cellOffset; // Add it here!

  return vec4f(gridPos, 0, 1);
}