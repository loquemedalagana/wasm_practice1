import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useWebGPUCanvas } from '@/wgpu/useWGPUCanvas';
import { useTextureFormat } from '@/wgpu/useTextureFormat';
import { useWebGPUContext } from '@/wgpu/useWGPUContextContext';

import use2dDotCircle from '@/samples/2d/circle/use2dDotCircle';

const Main: React.FC = () => {
  const device = useGPUDevice();
  const canvas = useWebGPUCanvas();
  const context = useWebGPUContext();
  const textureFormat = useTextureFormat();

  use2dDotCircle({
    device,
    context,
    textureFormat,
    canvas,
  });

  return (
    <></>
  );
};

export default Main;
