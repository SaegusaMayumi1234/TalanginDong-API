export default (object: any, keys: PropertyKey[]) => {
  return keys.reduce((obj: any, key: PropertyKey) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
