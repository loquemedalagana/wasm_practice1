const initDevice = async (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasConfig: Pick<GPUCanvasConfiguration, 'alphaMode'>,
) => {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('No appropriate GPUAdapter found.');
  }
  if (!canvasRef.current) {
    throw new Error('No appropriate canvas found.');
  }
  const device = await adapter.requestDevice();
  const context = canvasRef.current.getContext('webgpu');

  if (!context) {
    throw new Error('No appropriate context found.');
  }

  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device: device,
    format: canvasFormat,
    ...canvasConfig,
  });

  return {
    device,
    context,
    canvasFormat,
  };
};

export default initDevice;
