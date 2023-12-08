import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useWebGPUCanvas } from '@/wgpu/useWGPUCanvas';
import { useTextureFormat } from '@/wgpu/useTextureFormat';
import { useWebGPUContext } from '@/wgpu/useWGPUContextContext';
import use2dGrid from '@/samples/2d/grid/use2dGrid';

const Main: React.FC = () => {
  const device = useGPUDevice();
  const canvas = useWebGPUCanvas();
  const context = useWebGPUContext();
  const textureFormat = useTextureFormat();

  use2dGrid({
    device,
    context,
    textureFormat,
  });

  return (
    <h2>
      hello grid {canvas.clientWidth} X {canvas.clientHeight}
    </h2>
  );
};

export default Main;
