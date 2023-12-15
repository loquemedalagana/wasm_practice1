import { useGPUDevice } from '@/wgpu/useWebGPUDevice';
import { useWebGPUCanvas } from '@/wgpu/useWGPUCanvas';
import { useTextureFormat } from '@/wgpu/useTextureFormat';
import { useWebGPUContext } from '@/wgpu/useWGPUContextContext';

import Vec3InputGroup from '@/components/ControlPanelVec3/Vec3InputGroup';
import use3dBasicCube from '@/samples/3d/cube_basic/use3dBasicCube';
import CheckBox from '@/components/CheckBox/CheckBox';
import StyledHr from '@/components/StyledHr/StyledHr';
import CheckBoxGroup from '@/components/CheckBox/CheckBoxGroup';

const Main: React.FC = () => {
  const device = useGPUDevice();
  const canvas = useWebGPUCanvas();
  const context = useWebGPUContext();
  const textureFormat = useTextureFormat();

  const {
    translationVec3Control,
    rotationVec3Control,
    scaleVec3Control,
    wireFrameActive,
    handleWireFrame,
    animationActive,
    handleAnimation,
  } = use3dBasicCube({
    device,
    context,
    textureFormat,
    canvas,
  });

  return (
    <div>
      <CheckBoxGroup>
        <CheckBox
          name="animation"
          checked={animationActive}
          handleChange={handleAnimation}
          placeholder="animation"
        />
        <CheckBox
          name="wireframe"
          checked={wireFrameActive}
          handleChange={handleWireFrame}
          placeholder="wireframe"
        />
      </CheckBoxGroup>
      {!animationActive && (
        <>
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
            disabled={[true, true, false]}
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
        </>
      )}
    </div>
  );
};

export default Main;
