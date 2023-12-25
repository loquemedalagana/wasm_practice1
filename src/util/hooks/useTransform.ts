import { useMemo } from 'react';
import { mat4, Vec3 } from 'wgpu-matrix';

export interface TransformInput {
  translation: Vec3;
  rotation: Vec3;
  scaling: Vec3;
}

const useTransform = (transformInput: TransformInput) => {
  const { translation, rotation, scaling } = transformInput;
  const getModelMatrix = useMemo(() => {
    const scaledMatrix = mat4.scaling(scaling);
    const translationMatrix = mat4.translation(translation);
    const rotateXMatrix = mat4.rotationX(rotation[0]);
    const rotateYMatrix = mat4.rotationY(rotation[1]);
    const rotateZMatrix = mat4.rotationZ(rotation[2]);

    return mat4.multiply(
      mat4.multiply(
        mat4.multiply(
          mat4.multiply(scaledMatrix, rotateXMatrix),
          rotateYMatrix,
        ),
        rotateZMatrix,
      ),
      translationMatrix,
    );
  }, [translation, rotation, scaling]);

  return {
    getModelMatrix,
  };
};

export default useTransform;
export const initialTransformInput: TransformInput = {
  translation: [0, 0, 0],
  rotation: [0, 0, 0],
  scaling: [1, 1, 1],
};
