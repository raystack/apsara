import type { SVGProps } from 'react';

/**
 * The GitHub mark, drawn here rather than imported.
 *
 * lucide dropped its brand icons in 1.0, so `Github` no longer exists. A brand
 * mark is the one kind of icon a general icon set can't carry — the shape
 * belongs to its owner, not to the set — so it lives with the one link that
 * uses it.
 */
export function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={12}
      height={12}
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
      {...props}
    >
      <path d='M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.2.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z' />
    </svg>
  );
}
