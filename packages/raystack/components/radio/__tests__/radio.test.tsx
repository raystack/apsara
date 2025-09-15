import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioItem } from '../radio';
import styles from '../radio.module.css';

describe('Radio', () => {
  describe('Basic Rendering', () => {
    it('renders radio group', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
        </Radio>
      );
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
    });

    it('renders multiple radio items', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
          <RadioItem value='option3' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('applies radio class to group', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
        </Radio>
      );
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass(styles.radio);
    });

    it('applies radioitem class to items', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
        </Radio>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass(styles.radioitem);
    });

    // it('renders indicator for each item', () => {
    //   const { container } = render(
    //     <Radio>
    //       <RadioItem value='option1' />
    //       <RadioItem value='option2' />
    //     </Radio>
    //   );
    //   const indicators = container.querySelectorAll(`.${styles.indicator}`);
    //   expect(indicators).toHaveLength(2);
    // });
  });

  describe('Selection Behavior', () => {
    it('allows single selection', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');

      fireEvent.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      fireEvent.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });

    it('works with defaultValue', () => {
      render(
        <Radio defaultValue='option2'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
          <RadioItem value='option3' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it('works as controlled component', () => {
      const { rerender } = render(
        <Radio value='option1'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      rerender(
        <Radio value='option2'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });

    it('calls onValueChange when selection changes', () => {
      const handleChange = vi.fn();
      render(
        <Radio onValueChange={handleChange}>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const radio2 = screen.getAllByRole('radio')[1];
      fireEvent.click(radio2);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Disabled State', () => {
    it('disables entire radio group', () => {
      render(
        <Radio disabled>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });

    it('disables individual radio items', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' disabled />
          <RadioItem value='option3' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeDisabled();
      expect(radios[1]).toBeDisabled();
      expect(radios[2]).not.toBeDisabled();
    });

    it('does not allow selection of disabled items', () => {
      const handleChange = vi.fn();
      render(
        <Radio onValueChange={handleChange}>
          <RadioItem value='option1' />
          <RadioItem value='option2' disabled />
        </Radio>
      );

      const disabledRadio = screen.getAllByRole('radio')[1];
      fireEvent.click(disabledRadio);

      expect(handleChange).not.toHaveBeenCalled();
      expect(disabledRadio).not.toBeChecked();
    });
  });

  // describe('Keyboard Navigation', () => {
  //   // it('supports arrow key navigation', () => {
  //   //   render(
  //   //     <Radio>
  //   //       <RadioItem value='option1' />
  //   //       <RadioItem value='option2' />
  //   //       <RadioItem value='option3' />
  //   //     </Radio>
  //   //   );

  //   //   const [radio1, radio2, radio3] = screen.getAllByRole('radio');

  //   //   // Focus first radio
  //   //   radio1.focus();
  //   //   expect(document.activeElement).toBe(radio1);

  //   //   // Arrow down should move to next
  //   //   fireEvent.keyDown(radio1, { key: 'ArrowDown' });
  //   //   expect(document.activeElement).toBe(radio2);

  //   //   // Arrow down again
  //   //   fireEvent.keyDown(radio2, { key: 'ArrowDown' });
  //   //   expect(document.activeElement).toBe(radio3);

  //   //   // Arrow up should move to previous
  //   //   fireEvent.keyDown(radio3, { key: 'ArrowUp' });
  //   //   expect(document.activeElement).toBe(radio2);
  //   // });

  //   // it('wraps around when navigating past boundaries', () => {
  //   //   render(
  //   //     <Radio>
  //   //       <RadioItem value='option1' />
  //   //       <RadioItem value='option2' />
  //   //       <RadioItem value='option3' />
  //   //     </Radio>
  //   //   );

  //   //   const [radio1, , radio3] = screen.getAllByRole('radio');

  //   //   // Focus last radio
  //   //   radio3.focus();

  //   //   // Arrow down from last should wrap to first
  //   //   fireEvent.keyDown(radio3, { key: 'ArrowDown' });
  //   //   expect(document.activeElement).toBe(radio1);

  //   //   // Arrow up from first should wrap to last
  //   //   fireEvent.keyDown(radio1, { key: 'ArrowUp' });
  //   //   expect(document.activeElement).toBe(radio3);
  //   // });

  //   // it('selects item with Space key', () => {
  //   //   const handleChange = vi.fn();
  //   //   render(
  //   //     <Radio onValueChange={handleChange}>
  //   //       <RadioItem value='option1' />
  //   //       <RadioItem value='option2' />
  //   //     </Radio>
  //   //   );

  //   //   const radio2 = screen.getAllByRole('radio')[1];
  //   //   radio2.focus();
  //   //   fireEvent.keyDown(radio2, { key: ' ' });

  //   //   expect(handleChange).toHaveBeenCalledWith('option2');
  //   //   expect(radio2).toBeChecked();
  //   // });
  // });

  describe('Accessibility', () => {
    it('has correct ARIA attributes on group', () => {
      render(
        <Radio aria-label='Select an option'>
          <RadioItem value='option1' />
        </Radio>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-label', 'Select an option');
    });

    it('has correct ARIA attributes on items', () => {
      render(
        <Radio defaultValue='option1'>
          <RadioItem value='option1' aria-label='First option' />
          <RadioItem value='option2' aria-label='Second option' />
        </Radio>
      );

      const radio1 = screen.getByLabelText('First option');
      const radio2 = screen.getByLabelText('Second option');

      expect(radio1).toHaveAttribute('aria-checked', 'true');
      expect(radio2).toHaveAttribute('aria-checked', 'false');
    });

    it('supports required attribute', () => {
      render(
        <Radio required>
          <RadioItem value='option1' />
        </Radio>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-required', 'true');
    });

    // it('maintains proper radio group semantics', () => {
    //   render(
    //     <Radio name='options'>
    //       <RadioItem value='option1' />
    //       <RadioItem value='option2' />
    //     </Radio>
    //   );

    //   const radios = screen.getAllByRole('radio');
    //   radios.forEach(radio => {
    //     expect(radio).toHaveAttribute('name', 'options');
    //   });
    // });
  });

  describe('Custom Classes', () => {
    it('applies custom className to RadioItem', () => {
      render(
        <Radio>
          <RadioItem value='option1' className='custom-radio' />
        </Radio>
      );

      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('custom-radio');
      expect(radio).toHaveClass(styles.radioitem);
    });
  });

  describe('Form Integration', () => {
    // it('works with form name attribute', () => {
    //   render(
    //     <form>
    //       <Radio name='preference'>
    //         <RadioItem value='yes' />
    //         <RadioItem value='no' />
    //       </Radio>
    //     </form>
    //   );

    //   const radios = screen.getAllByRole('radio');
    //   radios.forEach(radio => {
    //     expect(radio).toHaveAttribute('name', 'preference');
    //   });
    // });

    it('respects form disabled state', () => {
      render(
        <fieldset disabled>
          <Radio>
            <RadioItem value='option1' />
            <RadioItem value='option2' />
          </Radio>
        </fieldset>
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });
  });

  describe('Orientation', () => {
    // it('supports vertical orientation by default', () => {
    //   render(
    //     <Radio>
    //       <RadioItem value='option1' />
    //       <RadioItem value='option2' />
    //     </Radio>
    //   );

    //   const radioGroup = screen.getByRole('radiogroup');
    //   expect(radioGroup).toHaveAttribute('aria-orientation', 'vertical');
    // });

    it('supports horizontal orientation', () => {
      render(
        <Radio orientation='horizontal'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('Data Attributes', () => {
    it('has data-state attribute on items', () => {
      render(
        <Radio defaultValue='option1'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');
      expect(radio1).toHaveAttribute('data-state', 'checked');
      expect(radio2).toHaveAttribute('data-state', 'unchecked');
    });

    it('has data-disabled attribute when disabled', () => {
      render(
        <Radio>
          <RadioItem value='option1' disabled />
        </Radio>
      );

      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('data-disabled', '');
    });
  });
});
