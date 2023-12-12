class CubeMesh {
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
  numberOfVertices: number;

  constructor() {
    this.positions = new Float32Array(positions);
    this.colors = new Float32Array(colors);
    this.indices = new Uint32Array(indices);
    this.numberOfVertices = this.positions.length / 3;
  }
}

export default CubeMesh;

// prettier-ignore
const positions = [
  // front
  -1, -1,  1,
  1, -1,  1,
  1,  1,  1,
  1,  1,  1,
  -1,  1,  1,
  -1, -1,  1,

  // right
  1, -1,  1,
  1, -1, -1,
  1,  1, -1,
  1,  1, -1,
  1,  1,  1,
  1, -1,  1,

  // back
  -1, -1, -1,
  -1,  1, -1,
  1,  1, -1,
  1,  1, -1,
  1, -1, -1,
  -1, -1, -1,

  // left
  -1, -1,  1,
  -1,  1,  1,
  -1,  1, -1,
  -1,  1, -1,
  -1, -1, -1,
  -1, -1,  1,

  // top
  -1,  1,  1,
  1,  1,  1,
  1,  1, -1,
  1,  1, -1,
  -1,  1, -1,
  -1,  1,  1,

  // bottom
  -1, -1,  1,
  -1, -1, -1,
  1, -1, -1,
  1, -1, -1,
  1, -1,  1,
  -1, -1,  1
];

// prettier-ignore
const colors = [
  // front - blue
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // right - red
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  //back - yellow
  1, 1, 0,
  1, 1, 0,
  1, 1, 0,
  1, 1, 0,
  1, 1, 0,
  1, 1, 0,

  //left - aqua
  0, 1, 1,
  0, 1, 1,
  0, 1, 1,
  0, 1, 1,
  0, 1, 1,
  0, 1, 1,

  // top - green
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // bottom - fuchsia
  1, 0, 1,
  1, 0, 1,
  1, 0, 1,
  1, 0, 1,
  1, 0, 1,
  1, 0, 1
];

// prettier-ignore
const indices = [
  0, 1, 2, 0, 2, 3, // TOP
  4, 5, 6, 4, 6, 7, // bottom
  8, 9, 10, 8, 10, 11, // front
  12, 13, 14, 12, 14, 15, // back
  16, 17, 18, 16, 18, 19, // left
  20, 21, 22, 20, 22, 23, // right
];
