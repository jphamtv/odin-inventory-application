// utils/caseTransformer.js
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

const transformKeys = (obj, transformer) => {
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

const transformToCamelCase = (obj) => transformKeys(obj, toCamelCase);

module.exports = {
  transformToCamelCase,
};
