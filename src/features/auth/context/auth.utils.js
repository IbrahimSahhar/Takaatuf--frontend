export const get = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  }
  return null;
};

export const isNonEmpty = (v) => v != null && String(v).trim().length > 0;
