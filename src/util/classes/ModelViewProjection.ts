import { Mat4, mat4, Vec3 } from 'wgpu-matrix';

class ModelViewProjection {
  viewMatrix: Mat4;
  projectionMatrix: Mat4;
  viewProjectionMatrix: Mat4;

  constructor(
    aspectRatio: number = 1.0,
    cameraPosition: Vec3 = [2, 2, 4],
    lookDirection: Vec3 = [0, 0, 0],
    upDirection: Vec3 = [0, 1, 0],
  ) {
    this.viewMatrix = mat4.lookAt(cameraPosition, lookDirection, upDirection);
    this.projectionMatrix = mat4.perspective(
      (2 * Math.PI) / 5,
      aspectRatio,
      0.1,
      100.0,
    );
    this.viewProjectionMatrix = mat4.multiply(
      this.projectionMatrix,
      this.viewMatrix,
    );
  }
}

export default ModelViewProjection;
