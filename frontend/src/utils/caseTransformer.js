// src/utils/caseTransformer.js
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};


const transformKeys = (obj, transformer) => {
  // Handle null and undefined
  if (obj == null) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(v => transformKeys(v, transformer));
  }
  
  // Handle objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [transformer(key)]: transformKeys(obj[key], transformer),
      }),
      {},
    );
  }
  
  // Return primitive values as-is
  return obj;
};

const transformToCamelCase = (obj) => transformKeys(obj, toCamelCase);
const transformToSnakeCase = (obj) => transformKeys(obj, toSnakeCase);

export { transformToCamelCase, transformToSnakeCase };
