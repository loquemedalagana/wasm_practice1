import { mat4, Mat4, Vec3 } from 'wgpu-matrix';

class Transform {
  public modelMatrix: Mat4;
  private readonly scaledMatrix: Mat4;
  private readonly rotateXMatrix: Mat4;
  private readonly rotateYMatrix: Mat4;
  private readonly rotateZMatrix: Mat4;
  private readonly translateMatrix: Mat4;

  constructor(
    translation: Vec3 = [0, 0, 0],
    rotation: Vec3 = [0, 0, 0],
    scaling: Vec3 = [0, 0, 0],
  ) {
    this.scaledMatrix = mat4.scaling(scaling);
    this.translateMatrix = mat4.translation(translation);

    this.rotateXMatrix = mat4.rotationX(rotation[0]);
    this.rotateYMatrix = mat4.rotationY(rotation[1]);
    this.rotateZMatrix = mat4.rotationZ(rotation[2]);

    this.modelMatrix = mat4.multiply(
      mat4.multiply(
        mat4.multiply(
          mat4.multiply(this.scaledMatrix, this.rotateXMatrix),
          this.rotateYMatrix,
        ),
        this.rotateZMatrix,
      ),
      this.translateMatrix,
    );
  }
}

export default Transform;
