/**
 * Transforms Date into string and removes functions
 */
export type Serialize<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends () => void
    ? never
    : T[P] extends {}
    ? Serialize<T[P]>
    : T[P];
};
