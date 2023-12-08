// Create a buffer with circle vertices
export const VERTEX_COUNT = 360; // Number of vertices to approximate the circle

export interface I2dCircleMesh {
  vertices: Float32Array;
}

export function create2dDotCircleMesh(vertexCount: number): I2dCircleMesh {
  const vertices = new Float32Array(VERTEX_COUNT * 2); // 2D position (x, y)

  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    vertices[i * 2] = x;
    vertices[i * 2 + 1] = y;
  }

  return { vertices };
}
