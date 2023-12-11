import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useWebGPUCanvas } from '@/wgpu/useWGPUCanvas';
import { useTextureFormat } from '@/wgpu/useTextureFormat';
import { useWebGPUContext } from '@/wgpu/useWGPUContextContext';
import use2dGrid, {
  MAX__GRID_SIZE,
  MIN__GRID_SIZE,
} from '@/samples/2d/grid/use2dGrid';

import InputSlider from '@/components/InputSlider/InputSlider';

const Main: React.FC = () => {
  const device = useGPUDevice();
  const canvas = useWebGPUCanvas();
  const context = useWebGPUContext();
  const textureFormat = useTextureFormat();

  const { gridCount, handleGridCountInput } = use2dGrid({
    device,
    context,
    textureFormat,
    canvas,
  });

  return (
    <>
      <h2>
        hello grid {canvas.clientWidth} X {canvas.clientHeight}
      </h2>
      <InputSlider
        min={MIN__GRID_SIZE}
        max={MAX__GRID_SIZE}
        handleInput={handleGridCountInput}
        value={gridCount}
        placeholder={<p>Current Grid cell count: {gridCount}</p>}
      />
    </>
  );
};

export default Main;
