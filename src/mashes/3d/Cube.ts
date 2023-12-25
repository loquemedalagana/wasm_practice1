import { Vec3, vec3 } from 'wgpu-matrix';

class CubeMesh {
  vertices: Float32Array;
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;

  constructor() {
    this.vertices = new Float32Array(
      positions.reduce((acc: number[], cur: Vec3, currentIndex) => {
        const curPos = cur as number[];
        const curColor = colors[currentIndex] as number[];
        return [...acc, ...curPos, ...curColor];
      }, []),
    );
    this.positions = new Float32Array(
      positions.reduce((acc: number[], cur: Vec3) => {
        const curArray = cur as number[];
        return [...acc, ...curArray];
      }, []),
    );
    this.colors = new Float32Array(
      colors.reduce((acc: number[], cur: Vec3) => {
        const curArray = cur as number[];
        return [...acc, ...curArray];
      }, []),
    );
    this.indices = new Uint32Array(indices);
  }
}

export default CubeMesh;

// prettier-ignore
const positions = [
  // top
  vec3.create(-1, 1, -1),
  vec3.create(-1, 1, 1),
  vec3.create(1, 1, 1),
  vec3.create(1, 1, -1),

  // bottom
  vec3.create(-1, -1, -1),
  vec3.create(1, -1, -1),
  vec3.create(1, -1, 1),
  vec3.create(-1, -1, 1),

  // front
  vec3.create(-1, -1, -1),
  vec3.create(-1, 1, -1),
  vec3.create(1, 1, -1),
  vec3.create(1, -1, -1),

  // back
  vec3.create(-1, -1, 1),
  vec3.create(1, -1, 1),
  vec3.create(1, 1, 1),
  vec3.create(-1, 1, 1),

  // left
  vec3.create(-1, -1, 1),
  vec3.create(-1, 1, 1),
  vec3.create(-1, 1, -1),
  vec3.create(-1, -1, -1),

  // right
  vec3.create(1, -1, 1),
  vec3.create(1, -1, -1),
  vec3.create(1, 1, -1),
  vec3.create(1, 1, 1),
];

// prettier-ignore
const colors = [
  // top
  vec3.create(1, 0, 0),
  vec3.create(1, 0, 0),
  vec3.create(1, 0, 0),
  vec3.create(1, 0, 0),

  // bottom
  vec3.create(0, 1, 0),
  vec3.create(0, 1, 0),
  vec3.create(0, 1, 0),
  vec3.create(0, 1, 0),

  // front
  vec3.create(0, 0, 1),
  vec3.create(0, 0, 1),
  vec3.create(0, 0, 1),
  vec3.create(0, 0, 1),

  // back
  vec3.create(0, 1, 1),
  vec3.create(0, 1, 1),
  vec3.create(0, 1, 1),
  vec3.create(0, 1, 1),

  // left
  vec3.create(1, 1, 0),
  vec3.create(1, 1, 0),
  vec3.create(1, 1, 0),
  vec3.create(1, 1, 0),

  // right
  vec3.create(1, 0, 1),
  vec3.create(1, 0, 1),
  vec3.create(1, 0, 1),
  vec3.create(1, 0, 1),
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
