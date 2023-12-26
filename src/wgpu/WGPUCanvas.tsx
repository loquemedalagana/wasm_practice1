import {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useCombinedRefs } from '@/util/UI/useCombinedRef';
import { WebGPUCanvasContext } from '@/wgpu/useWGPUCanvas';
import { WebGPUContext } from '@/wgpu/useWGPUContextContext';
import { TextureFormatContext } from '@/wgpu/useTextureFormat';
import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useAutoSize } from '@/util/UI/useAutoSize';

import styles from '@/wgpu/canvas.module.css';

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

interface IWGPUCanvas {
  width?: number;
  height?: number;
  fullscreen?: boolean;
  downscale?: number;
}

const WGPUCanvas = forwardRef<
  HTMLCanvasElement,
  IWGPUCanvas & PropsWithChildren
>(({ children, downscale = 0, width, height, fullscreen = true }, ref) => {
  const autoSize = useAutoSize();
  const ownRef = useRef<HTMLCanvasElement>(null);
  const inner = useCombinedRefs<HTMLCanvasElement>(ref, ownRef, autoSize);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<GPUCanvasContext | null>(null);
  const [textureFormat, setTextureFormat] = useState<GPUTextureFormat | null>(
    null,
  );
  const device = useGPUDevice();

  useEffect(() => {
    if (device) {
      setCanvas(ownRef.current);
      if (ownRef.current) {
        const gpuContext = ownRef.current.getContext('webgpu');

        if (gpuContext) {
          setContext(gpuContext);
          configureContextPresentation(device, gpuContext);
          setTextureFormat(getPreferredCanvasFormat());
        } else {
          throw new Error('Failed to request GPUCanvasContext');
        }
      }
    }
  }, []);

  const [className, size] = useMemo(() => {
    if (fullscreen) {
      return [
        `${styles.w_full} ${styles.h_full}`,
        { width: undefined, height: undefined },
      ];
    } else {
      return ['', { width, height }];
    }
  }, [fullscreen, width, height]);

  console.log(size.width, size.height);

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
      <canvas
        ref={inner}
        id="wgpu-canvas"
        width={size.width}
        height={size.height}
        className={`${className} ${downscale ? styles.downscale ?? '' : ''}`}
      ></canvas>
    </>
  );
});

WGPUCanvas.displayName = 'WGPUCanvas';

export default WGPUCanvas;
