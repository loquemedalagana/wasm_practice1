@group(0) @binding(0) var<uniform> grid: vec2f;

@vertex
fn main(@location(0) pos: vec2f) ->
  @builtin(position) vec4f {
  return vec4f(pos / grid, 0, 1);
}