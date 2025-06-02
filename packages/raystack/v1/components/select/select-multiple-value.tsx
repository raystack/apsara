import { cx } from 'class-variance-authority';
import { Chip } from '../chip';
import { useSelectContext } from './select-root';
import styles from './select.module.css';
import { ItemType } from './types';

interface SelectMultipleValueProps {
  data: ItemType[];
}
export const SelectMultipleValue = ({
  data = []
}: SelectMultipleValueProps) => {
  const { setValue } = useSelectContext();
  return (
    <div className={cx(styles.valueContent)}>
      {data.map(item => (
        <Chip
          key={item.value}
          leadingIcon={item.leadingIcon}
          isDismissible
          onDismiss={() => {
            setValue(item.value);
          }}
        >
          {typeof item.children === 'string' ? item.children : item.value}
        </Chip>
      ))}
    </div>
  );
};
