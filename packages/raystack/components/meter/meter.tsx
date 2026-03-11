import { MeterLabel, MeterValue } from './meter-misc';
import { MeterRoot } from './meter-root';
import { MeterTrack } from './meter-track';

export const Meter = Object.assign(MeterRoot, {
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack
});
