import {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useCombinedRefs } from '@/util/UI/useCombinedRef';
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
  });
}

interface IWGPUCanvas {}

const WGPUCanvas = forwardRef<
  HTMLCanvasElement,
  IWGPUCanvas & PropsWithChildren
>(({ children }, ref) => {
  const ownRef = useRef<HTMLCanvasElement>(null);
  const inner = useCombinedRefs<HTMLCanvasElement>(ref, ownRef);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<GPUCanvasContext | null>(null);
  const [textureFormat, setTextureFormat] = useState<GPUTextureFormat | null>(
    null,
  );
  const device = useGPUDevice();

  useEffect(() => {
    setCanvas(ownRef.current);
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
  }, []);

  return (
    <>
      <canvas ref={inner} className="canvas"></canvas>
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
    </>
  );
});

WGPUCanvas.displayName = 'WGPUCanvas';

export default WGPUCanvas;