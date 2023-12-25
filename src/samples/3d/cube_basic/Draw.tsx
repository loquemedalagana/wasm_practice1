import { mat4, Vec4 } from 'wgpu-matrix';

import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useWebGPUCanvas } from '@/wgpu/useWGPUCanvas';
import { useTextureFormat } from '@/wgpu/useTextureFormat';
import { useWebGPUContext } from '@/wgpu/useWGPUContextContext';

import Vec3InputGroup from '@/components/ControlPanelVec3/Vec3InputGroup';
import use3dBasicCube from '@/samples/3d/cube_basic/use3dBasicCube';
import CheckBox from '@/components/CheckBox/CheckBox';
import StyledHr from '@/components/StyledHr/StyledHr';
import CheckBoxGroup from '@/components/CheckBox/CheckBoxGroup';
import { IVec3Control } from '@/util/hooks/useVec3Control';

interface Props {
  modelMatrix: Vec4;
  viewProjectionMatrix: Vec4;
  translationVec3Control: IVec3Control;
  rotationVec3Control: IVec3Control;
  scaleVec3Control: IVec3Control;
}

const Draw: React.FC<Props> = ({
  modelMatrix,
  viewProjectionMatrix,
  translationVec3Control,
  scaleVec3Control,
  rotationVec3Control,
}) => {
  const device = useGPUDevice();
  const canvas = useWebGPUCanvas();
  const context = useWebGPUContext();
  const textureFormat = useTextureFormat();

  const { wireFrameActive, handleWireFrame } = use3dBasicCube(
    {
      device,
      context,
      textureFormat,
      canvas,
    },
    mat4.multiply(modelMatrix, viewProjectionMatrix),
  );

  return (
    <div>
      <CheckBoxGroup>
        <CheckBox
          name="wireframe"
          checked={wireFrameActive}
          handleChange={handleWireFrame}
          placeholder="wireframe"
        />
      </CheckBoxGroup>
      <StyledHr />
      <Vec3InputGroup
        v3={translationVec3Control.v3}
        minV3={translationVec3Control.minV3}
        maxV3={translationVec3Control.maxV3}
        label={'translation'}
        handleInput={translationVec3Control.handleChangeInput}
        step={translationVec3Control.step}
        disabled={[false, false, true]}
      />
      <Vec3InputGroup
        v3={rotationVec3Control.v3}
        minV3={rotationVec3Control.minV3}
        maxV3={rotationVec3Control.maxV3}
        label={'rotation'}
        handleInput={rotationVec3Control.handleChangeInput}
        step={rotationVec3Control.step}
        disabled={[false, false, false]}
      />
      <Vec3InputGroup
        v3={scaleVec3Control.v3}
        minV3={scaleVec3Control.minV3}
        maxV3={scaleVec3Control.maxV3}
        label={'scale'}
        handleInput={scaleVec3Control.handleChangeInput}
        step={scaleVec3Control.step}
        disabled={[false, false, true]}
      />
    </div>
  );
};

export default Draw;
