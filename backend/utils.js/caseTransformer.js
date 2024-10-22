// utils/caseTransformer.js
export const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

export const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const transformKeys = (obj, transformer) => {
  if (Array.isArray(obj)) {
    return obj.map(v => transformKeys(v, transformer));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [transformer(key)]: transformKeys(obj[key], transformer),
      }),
      {},
    );
  }
  return obj;
};

export const transformToCamelCase = (obj) => transformKeys(obj, toCamelCase);
export const transformToSnakeCase = (obj) => transformKeys(obj, toSnakeCase);
