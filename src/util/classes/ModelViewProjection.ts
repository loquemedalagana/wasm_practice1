import { Mat4, mat4, Vec3 } from 'wgpu-matrix';

class ModelViewProjection {
  viewMatrix: Mat4;
  projectionMatrix: Mat4;
  viewProjectionMatrix: Mat4;

  constructor(
    aspectRatio: number = 1.0,
    viewEyePosition: Vec3 = [2, 2, 4],
    viewEyeDirection: Vec3 = [0, 0, 1],
    viewUp: Vec3 = [0, -1, 0],
    nearZ: number = 0.01,
    farZ: number = 100.0,
  ) {
    this.viewMatrix = mat4.lookAt(viewEyePosition, viewEyeDirection, viewUp);
    this.projectionMatrix = mat4.perspective(
      (2 * Math.PI) / 5,
      aspectRatio,
      nearZ,
      farZ,
    );
    this.viewProjectionMatrix = mat4.multiply(
      this.projectionMatrix,
      this.viewMatrix,
    );
  }
}

export default ModelViewProjection;
