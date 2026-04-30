import { InputField } from '@raystack/apsara';
import { useState } from 'react';

export default function ChipInputDemo() {
  const [chips, setChips] = useState([
    { label: 'Tag1' },
    { label: 'Tag2' },
    { label: 'Tag3' },
    { label: 'Tag4' },
    { label: 'Tag5' }
  ]);
  const [input, setInput] = useState('');

  return (
    <InputField
      placeholder='Type and press Enter...'
      width='560px'
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && input.trim()) {
          setChips(prev => [...prev, { label: input.trim() }]);
          setInput('');
        }
      }}
      chips={chips.map((c, i) => ({
        label: c.label,
        onRemove: () => setChips(prev => prev.filter((_, j) => j !== i))
      }))}
      maxChipsVisible={4}
    />
  );
}
