import { Chip, Input } from '@raystack/apsara';
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
    <Input
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
      chips={chips.map((c, i) => (
        <Chip key={i}>
          {c.label}
          <Chip.Remove
            onClick={() => setChips(prev => prev.filter((_, j) => j !== i))}
          />
        </Chip>
      ))}
      maxChipsVisible={4}
    />
  );
}
