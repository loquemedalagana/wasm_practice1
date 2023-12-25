import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { WebGPUCanvasContext } from '@/wgpu/useWGPUCanvas';
import { WebGPUContext } from '@/wgpu/useWGPUContextContext';
import { TextureFormatContext } from '@/wgpu/useTextureFormat';
import { useGPUDevice } from '@/wgpu/useWebGPUDevice';

function getPreferredCanvasFormat() {
  return navigator.gpu.getPreferredCanvasFormat();
}

function configureContextPresentation(
  device: GPUDevice,
  context: GPUCanvasContext,
) {
  const presentationFormat = getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'opaque',
  });
}

interface IWGPUCanvas {}

const WGPUCanvas: React.FC<IWGPUCanvas & PropsWithChildren> = ({
  children,
}) => {
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const ownRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<GPUCanvasContext | null>(null);
  const [textureFormat, setTextureFormat] = useState<GPUTextureFormat | null>(
    null,
  );
  const device = useGPUDevice();

  const resizeCanvas = useCallback(() => {
    if (canvasBoxRef.current && ownRef.current) {
      ownRef.current.width = canvasBoxRef.current.clientWidth;
      ownRef.current.height = canvasBoxRef.current.clientHeight;
      console.log(ownRef.current.width, ownRef.current.height);
      setCanvas(ownRef.current);
    }
  }, [canvasBoxRef, ownRef]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    if (device && ownRef.current) {
      const gpuContext = ownRef.current.getContext('webgpu');
      if (gpuContext) {
        setContext(gpuContext);
        configureContextPresentation(device, gpuContext);
        setTextureFormat(getPreferredCanvasFormat());
      } else {
        throw new Error('Failed to request GPUCanvasContext');
      }
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {canvas ? (
        <WebGPUCanvasContext.Provider value={canvas}>
          {context && (
            <WebGPUContext.Provider value={context}>
              {textureFormat && (
                <TextureFormatContext.Provider value={textureFormat}>
                  {children}
                </TextureFormatContext.Provider>
              )}
            </WebGPUContext.Provider>
          )}
        </WebGPUCanvasContext.Provider>
      ) : (
        <LoadingSpinner />
      )}
      <div ref={canvasBoxRef} id="wgpu-box">
        <canvas ref={ownRef} id="wgpu-canvas"></canvas>
      </div>
    </>
  );
};

export default WGPUCanvas;
