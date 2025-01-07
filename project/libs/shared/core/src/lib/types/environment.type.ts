export const ENVIRONMENTS = ['development', 'production', 'stage'] as const;

export type Environment = typeof ENVIRONMENTS[number];
