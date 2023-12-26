'use client';
import WGPUDevice from '@/wgpu/WGPUDevice';
import WGPUCanvas from '@/wgpu/WGPUCanvas';
import Draw from '@/samples/3d/cube_basic/Draw';
import { ModelViewProjectionContextProvider } from '@/util/contexts/ModelViewProjectionContext';

const Main: React.FC = () => {
  return (
    <WGPUDevice>
      <WGPUCanvas>
        <ModelViewProjectionContextProvider>
          <Draw />
        </ModelViewProjectionContextProvider>
      </WGPUCanvas>
    </WGPUDevice>
  );
};

export default Main;
