import { PropsWithChildren } from 'react';
import styles from '@/components/CheckBox/checkbox.module.css';

const CheckBoxGroup: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <div className={styles.checkbox__group} {...rest}>
      {children}
    </div>
  );
};

export default CheckBoxGroup;
