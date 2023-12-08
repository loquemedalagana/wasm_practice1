@group(0) @binding(0) var<uniform> grid: vec2f;

@vertex
fn main(@location(0) pos: vec2f) ->
  @builtin(position) vec4f {
  let gridPos = (pos + 1) / grid - 1;
  return vec4f(gridPos, 0, 1);
}