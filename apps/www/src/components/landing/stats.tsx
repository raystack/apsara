import styles from './landing.module.css';

const STATS: Array<{ label: string; value: string; unit?: string }> = [
  { label: 'Components', value: '80', unit: '+' },
  { label: 'Primitives', value: 'Base UI' },
  { label: 'Runtime CSS', value: '0', unit: 'kb' },
  { label: 'License', value: 'Apache 2.0' }
];

export default function Stats() {
  return (
    <div className={styles.stats}>
      {STATS.map(stat => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.label}>{stat.label}</span>
          <span className={styles.statValue}>
            {stat.value}
            {stat.unit && <small>{stat.unit}</small>}
          </span>
        </div>
      ))}
    </div>
  );
}
