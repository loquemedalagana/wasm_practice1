import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useWebGPUCanvas } from '@/wgpu/useWGPUCanvas';
import { useTextureFormat } from '@/wgpu/useTextureFormat';
import { useWebGPUContext } from '@/wgpu/useWGPUContextContext';
import use2dRectangle from '@/samples/2d/rectangle/use2dRectangle';

const Main: React.FC = () => {
  const device = useGPUDevice();
  const canvas = useWebGPUCanvas();
  const context = useWebGPUContext();
  const textureFormat = useTextureFormat();

  use2dRectangle({
    device,
    context,
    textureFormat,
  });

  return (
    <h2>
      hello rectangle {canvas.clientWidth} X {canvas.clientHeight}
    </h2>
  );
};

export default Main;
