'use client';
import WGPUDevice from '@/wgpu/WGPUDevice';
import WGPUCanvas from '@/wgpu/WGPUCanvas';
import Draw from '@/samples/2d/triangle/Draw';

const Main: React.FC = () => {
  return (
    <WGPUDevice>
      <WGPUCanvas>
        <Draw />
      </WGPUCanvas>
    </WGPUDevice>
  );
};

export default Main;
