import { ChangeEventHandler } from 'react';

import { V3 } from '@/util/types/math';
import styles from '@/components/InputSlider/input_slider.module.css';

interface InputSliderProps {
  name?: V3;
  placeholder?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  handleInput: ChangeEventHandler<HTMLInputElement>;
  step?: number;
  isVectorControl?: boolean;
}

const InputSlider: React.FC<InputSliderProps> = ({
  min,
  max,
  value,
  handleInput,
  name,
  isVectorControl = false,
  placeholder,
  step,
}) => {
  const boxStyle = isVectorControl
    ? `${styles.range__slider} ${styles.vector_input}`
    : `${styles.range__slider} ${styles.single_input}`;

  return (
    <div className={boxStyle}>
      {placeholder}
      <div>
        <input
          name={name}
          className={styles.sliderInput}
          type="range"
          min={min}
          max={max}
          defaultValue={value}
          onChange={handleInput}
          step={step}
        />
      </div>
    </div>
  );
};

export default InputSlider;
