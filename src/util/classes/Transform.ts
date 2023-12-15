import { mat4, Mat4, Vec3 } from 'wgpu-matrix';

class Transform {
  public modelMatrix: Mat4;
  private readonly rotateXMatrix: Mat4;
  private readonly rotateYMatrix: Mat4;
  private readonly rotateZMatrix: Mat4;
  private readonly translateMatrix: Mat4;

  constructor(
    translation: Vec3 = [0, 0, 0],
    rotation: Vec3 = [0, 0, 0],
    scaling: Vec3 = [0, 0, 0],
  ) {
    this.modelMatrix = mat4.scaling(scaling);
    this.translateMatrix = mat4.translate(this.modelMatrix, translation);

    this.rotateXMatrix = mat4.rotateX(this.modelMatrix, rotation[0]);
    this.rotateYMatrix = mat4.rotateY(this.modelMatrix, rotation[1]);
    this.rotateZMatrix = mat4.rotateZ(this.modelMatrix, rotation[2]);

    this.modelMatrix = mat4.multiply(this.modelMatrix, this.rotateXMatrix);
    this.modelMatrix = mat4.multiply(this.modelMatrix, this.rotateYMatrix);
    this.modelMatrix = mat4.multiply(this.modelMatrix, this.rotateZMatrix);
    this.modelMatrix = mat4.multiply(this.modelMatrix, this.translateMatrix);
  }
}

export default Transform;
