import { ChangeEventHandler } from 'react';

import styles from '@/components/CheckBox/checkbox.module.css';

interface CheckBoxProps {
  name: string;
  checked: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: React.ReactNode;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  placeholder,
  name,
  checked,
  handleChange,
}) => {
  return (
    <div className={styles.checkbox__wrapper}>
      <div>{placeholder}</div>
      <div className={styles.checkbox}>
        <div className={styles.check}>
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={handleChange}
          />
          <label htmlFor={name}></label>
        </div>
      </div>
    </div>
  );
};

export default CheckBox;
