export const nanoid = (size = 8) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(16).slice(2, 2 + size);
};
