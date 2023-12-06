'use client';
import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import { convertColorIntoVec4 } from '@/util/math/color';
import CanvasInfo from '@/components/CanvasInfo';

const _2DTriangle = () => {

  return <CanvasInfo />;
};

export default _2DTriangle;
