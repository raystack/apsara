import { describe, expect, it } from 'vitest';
import type { DataViewField } from '../data-view.types';
import { groupData } from '../utils';

/**
 * `groupData` produces the sections every renderer walks, so its bucket order
 * *is* the rendered section order — `DataView.List`'s bands and
 * `DataView.Timeline`'s group sections both read it.
 */
interface Task {
  id: string;
  priority?: string | null;
}

const field = (groupOrder?: string[]): DataViewField<Task> => ({
  accessorKey: 'priority',
  label: 'Priority',
  groupable: true,
  ...(groupOrder ? { groupOrder } : {})
});

const keys = (data: Task[], fields: DataViewField<Task>[]) =>
  groupData(data, 'priority', fields).map(group => group.group_key);

describe('groupData ordering', () => {
  const tasks: Task[] = [
    { id: '1', priority: 'Low' },
    { id: '2', priority: 'High' },
    { id: '3', priority: 'Low' },
    { id: '4', priority: 'Medium' }
  ];

  it('keeps first-seen order when the field declares none', () => {
    expect(keys(tasks, [field()])).toEqual(['Low', 'High', 'Medium']);
  });

  it('follows the field groupOrder', () => {
    expect(keys(tasks, [field(['High', 'Medium', 'Low'])])).toEqual([
      'High',
      'Medium',
      'Low'
    ]);
  });

  it('appends undeclared values in first-seen order', () => {
    expect(keys(tasks, [field(['Medium'])])).toEqual(['Medium', 'Low', 'High']);
  });

  it('skips declared values with no rows', () => {
    expect(keys(tasks, [field(['Urgent', 'High', 'Low', 'Medium'])])).toEqual([
      'High',
      'Low',
      'Medium'
    ]);
  });

  it('puts rows with no value in the last section', () => {
    const withEmpty: Task[] = [
      { id: '0', priority: null },
      ...tasks,
      { id: '5' }
    ];
    expect(keys(withEmpty, [field(['High', 'Medium', 'Low'])])).toEqual([
      'High',
      'Medium',
      'Low',
      ''
    ]);
  });

  it('puts rows with no value last without a declared order too', () => {
    const withEmpty: Task[] = [{ id: '0', priority: null }, ...tasks];
    expect(keys(withEmpty, [field()])).toEqual(['Low', 'High', 'Medium', '']);
  });

  it('preserves rows and counts per section', () => {
    const groups = groupData(tasks, 'priority', [
      field(['High', 'Medium', 'Low'])
    ]);
    expect(groups.map(group => group.count)).toEqual([1, 1, 2]);
    expect(groups[2].subRows.map(row => row.id)).toEqual(['1', '3']);
  });
});
