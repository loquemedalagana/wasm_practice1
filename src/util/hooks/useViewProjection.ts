import { useMemo } from 'react';
import { mat4, Vec3 } from 'wgpu-matrix';

export interface ViewProjectionInput {
  aspectRatio: number;
  viewEyePosition: Vec3;
  viewEyeDirection: Vec3;
  viewUp: Vec3;
  nearZ: number;
  farZ: number;
}

const useViewProjection = (transformInput: ViewProjectionInput) => {
  const {
    aspectRatio,
    viewEyeDirection,
    viewEyePosition,
    viewUp,
    nearZ,
    farZ,
  } = transformInput;

  const getViewProjectionMatrix = useMemo(() => {
    const viewMatrix = mat4.lookAt(viewEyePosition, viewEyeDirection, viewUp);
    const projectionMatrix = mat4.perspective(
      (2 * Math.PI) / 5,
      aspectRatio,
      nearZ,
      farZ,
    );
    return mat4.multiply(projectionMatrix, viewMatrix);
  }, [viewEyePosition, viewEyeDirection, viewUp, aspectRatio, nearZ, farZ]);

  return {
    getViewProjectionMatrix,
  };
};

export default useViewProjection;
export const initialViewProjectionInput: ViewProjectionInput = {
  aspectRatio: 1.0,
  viewEyePosition: [2, 2, 4],
  viewEyeDirection: [0, 0, 1],
  viewUp: [0, 1, 0],
  nearZ: 0.01,
  farZ: 100.0,
};
