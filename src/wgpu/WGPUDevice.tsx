import { useEffect, PropsWithChildren, useState } from 'react';
import { GPUDeviceContext } from '@/wgpu/useWebGPUDevice';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const WGPUDevice: React.FC<PropsWithChildren> = ({ children }) => {
  const [device, setDevice] = useState<GPUDevice>();

  useEffect(() => {
    const init = async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('No appropriate GPUAdapter found.');
      }
      const gpuDevice = await adapter.requestDevice();
      setDevice(gpuDevice);
    };

    init();
  }, []);

  return (
    <div id="wgpu-device">
      {device ? (
        <GPUDeviceContext.Provider value={device}>
          {children}
        </GPUDeviceContext.Provider>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default WGPUDevice;
