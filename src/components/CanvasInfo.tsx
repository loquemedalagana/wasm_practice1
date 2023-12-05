import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const CanvasInfo = () => {
  const { canvas } = useCanvasContext();

  useEffect(() => {
    console.log(canvas?.clientWidth, canvas?.clientHeight);
  }, [canvas?.clientHeight, canvas?.clientWidth]);

  return (
    <div>
      {canvas ? (
        <>
          <p>canvas width: {canvas.clientWidth}</p>
          <p>canvas height: {canvas.clientHeight}</p>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default CanvasInfo;
