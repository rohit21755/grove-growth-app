/**
 * Types for /states and /states/{stateId}/colleges API.
 * Extend fields to match your API schema.
 */
export type State = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export type College = {
  id: string;
  name: string;
  stateId?: string;
  [key: string]: unknown;
};
