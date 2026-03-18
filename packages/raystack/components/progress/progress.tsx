import { ProgressLabel, ProgressValue } from './progress-misc';
import { ProgressRoot } from './progress-root';
import { ProgressTrack } from './progress-track';

export const Progress = Object.assign(ProgressRoot, {
  Label: ProgressLabel,
  Value: ProgressValue,
  Track: ProgressTrack
});
