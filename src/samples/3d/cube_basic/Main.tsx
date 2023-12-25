'use client';
import WGPUDevice from '@/wgpu/WGPUDevice';
import WGPUCanvas from '@/wgpu/WGPUCanvas';
import Draw from '@/samples/3d/cube_basic/Draw';
import useVec3Control from '@/util/hooks/useVec3Control';
import useTransform, { initialTransformInput } from '@/util/hooks/useTransform';
import useViewProjection, {
  initialViewProjectionInput,
} from '@/util/hooks/useViewProjection';

const Main: React.FC = () => {
  const translationVec3Control = useVec3Control(
    initialTransformInput.translation,
    [-2, -2, -2],
    [2, 2, 2],
  );
  const rotationVec3Control = useVec3Control(
    initialTransformInput.rotation,
    [-Math.PI, -Math.PI, -Math.PI],
    [Math.PI, Math.PI, Math.PI],
  );
  const scaleVec3Control = useVec3Control(
    initialTransformInput.scaling,
    [0.1, 0.1, 0.1],
    [2.0, 2.0, 2.0],
  );

  const { getModelMatrix } = useTransform({
    translation: translationVec3Control.v3,
    rotation: rotationVec3Control.v3,
    scaling: scaleVec3Control.v3,
  });

  const { getViewProjectionMatrix } = useViewProjection(
    initialViewProjectionInput,
  );

  return (
    <WGPUDevice>
      <WGPUCanvas>
        <Draw
          modelMatrix={getModelMatrix}
          viewProjectionMatrix={getViewProjectionMatrix}
          translationVec3Control={translationVec3Control}
          rotationVec3Control={rotationVec3Control}
          scaleVec3Control={scaleVec3Control}
        />
      </WGPUCanvas>
    </WGPUDevice>
  );
};

export default Main;
