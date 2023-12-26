import { createContext, PropsWithChildren, useContext } from 'react';
import useTransform, { initialTransformInput } from '@/util/hooks/useTransform';
import useViewProjection, {
  initialViewProjectionInput,
} from '@/util/hooks/useViewProjection';
import useVec3Control, { IVec3Control } from '@/util/hooks/useVec3Control';
import { useAspectRatio } from '@/wgpu/useAspectRatio';
import { vec3, vec4, Vec4 } from 'wgpu-matrix';

interface IModelViewProjectionContext {
  translationVec3Control: IVec3Control;
  rotationVec3Control: IVec3Control;
  scaleVec3Control: IVec3Control;
  modelMatrix: Vec4;
  viewProjectionMatrix: Vec4;
}

const initialVec3Value: IVec3Control = {
  maxV3: vec3.create(),
  step: 0.01,
  handleChangeInput: () => {},
  minV3: vec3.create(),
  v3: vec3.create(),
};

const ModelViewProjectionContext = createContext<IModelViewProjectionContext>({
  modelMatrix: vec4.create(),
  viewProjectionMatrix: vec4.create(),
  translationVec3Control: initialVec3Value,
  rotationVec3Control: initialVec3Value,
  scaleVec3Control: initialVec3Value,
});

export const ModelViewProjectionContextProvider: React.FC<
  PropsWithChildren
> = ({ children }) => {
  const { aspectRatio } = useAspectRatio();

  const translationVec3Control = useVec3Control(
    initialTransformInput.translation,
    [-2, -2, -2],
    [2, 2, 2],
  );
  const rotationVec3Control = useVec3Control(
    initialTransformInput.rotation,
    [-Math.PI, -Math.PI, -Math.PI],
    [Math.PI, Math.PI, Math.PI],
  );
  const scaleVec3Control = useVec3Control(
    initialTransformInput.scaling,
    [0.1, 0.1, 0.1],
    [2.0, 2.0, 2.0],
  );

  const { getModelMatrix } = useTransform({
    translation: translationVec3Control.v3,
    rotation: rotationVec3Control.v3,
    scaling: scaleVec3Control.v3,
  });

  const { getViewProjectionMatrix } = useViewProjection({
    ...initialViewProjectionInput,
    aspectRatio,
  });

  return (
    <ModelViewProjectionContext.Provider
      value={{
        translationVec3Control,
        rotationVec3Control,
        scaleVec3Control,
        modelMatrix: getModelMatrix,
        viewProjectionMatrix: getViewProjectionMatrix,
      }}
    >
      {children}
    </ModelViewProjectionContext.Provider>
  );
};

export const useModelViewProjectionContext =
  (): IModelViewProjectionContext => {
    const context = useContext(ModelViewProjectionContext);
    return context;
  };
