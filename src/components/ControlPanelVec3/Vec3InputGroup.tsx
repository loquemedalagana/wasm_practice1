import { Vec3 } from 'wgpu-matrix';
import InputSlider from '@/components/InputSlider/InputSlider';
import { ChangeEventHandler } from 'react';

import styles from '@/components/ControlPanelVec3/vec3_input_group.module.css';

interface IControlPanelVec3 {
  v3: Vec3;
  minV3: Vec3;
  maxV3: Vec3;
  label: string; // TODO: will be changed -> model, view, proj
  handleInput: ChangeEventHandler<HTMLInputElement>;
  step: number;
}
const Vec3InputGroup: React.FC<IControlPanelVec3> = ({
  v3,
  minV3,
  maxV3,
  label,
  handleInput,
  step,
}) => {
  return (
    <div className={styles.vector__input_wrapper}>
      <h5>{label}</h5>
      <div className={styles.vector__input_group}>
        <InputSlider
          name={'x'}
          value={v3[0]}
          min={minV3[0]}
          max={maxV3[0]}
          handleInput={handleInput}
          step={step}
          isVectorControl={true}
          placeholder={<p>{`x`}</p>}
        />
        <InputSlider
          name={'y'}
          value={v3[1]}
          min={minV3[1]}
          max={maxV3[1]}
          handleInput={handleInput}
          step={step}
          isVectorControl={true}
          placeholder={<p>{`y`}</p>}
        />
        <InputSlider
          name={'z'}
          value={v3[2]}
          min={minV3[2]}
          max={maxV3[2]}
          handleInput={handleInput}
          step={step}
          isVectorControl={true}
          placeholder={<p>{`z`}</p>}
        />
        <p>{`(${v3[0].toFixed(3)},${v3[1].toFixed(3)},${v3[2].toFixed(3)})`}</p>
      </div>
    </div>
  );
};

export default Vec3InputGroup;
