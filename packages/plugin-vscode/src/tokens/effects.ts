/*
    Values for effects using default primitves
*/
export const shadow = {
  /* Shadows */
  feather:
    '0px 1px 1px 0px rgba(0, 0, 0, 0.06), 0px 4px 4px -1px rgba(0, 0, 0, 0.02)' /* sm */,
  soft: '0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)' /* md */,
  lifted:
    '0px 1px 1px 0px rgba(0, 0, 0, 0.07), 0px 2px 5px 0px rgba(0, 0, 0, 0.07), 0px 3px 8px 0px rgba(0, 0, 0, 0.07)' /* lg */,
  floating:
    '0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px 3px 17px 0px rgba(0, 0, 0, 0.04), 0px 4px 30px 0px rgba(0, 0, 0, 0.13)' /* xl */,
  inset: '0px 1px 1px 0px rgba(0, 0, 0, 0.04) inset'
} as const;

export const blur = {
  sm: 'blur(0.5px)',
  md: 'blur(1px)',
  lg: 'blur(2px)',
  xl: 'blur(4px)'
} as const;
