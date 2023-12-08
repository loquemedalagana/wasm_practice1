import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const CanvasInfo = () => {
  const { canvasRef } = useCanvasContext();
  const canvas = canvasRef.current;

  useEffect(() => {
    console.log(canvas?.clientWidth, canvas?.clientHeight);
  }, [canvas?.clientHeight, canvas?.clientWidth]);

  return <div>{canvas ? <></> : <LoadingSpinner />}</div>;
};

export default CanvasInfo;
