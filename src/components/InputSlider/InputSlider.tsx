import { ChangeEventHandler } from 'react';

import styles from '@/components/InputSlider/input_slider.module.css';

interface InputSliderProps {
  label?: 'x' | 'y' | 'z';
  placeholder?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  handleInput: ChangeEventHandler<HTMLInputElement>;
}

const InputSlider: React.FC<InputSliderProps> = ({
  min,
  max,
  value,
  handleInput,
  label,
  placeholder,
}) => {
  return (
    <div className={styles.range__slider}>
      {placeholder}
      <input
        className={styles.sliderInput}
        type="range"
        min={min}
        max={max}
        defaultValue={value}
        onChange={handleInput}
      />
    </div>
  );
};

export default InputSlider;
