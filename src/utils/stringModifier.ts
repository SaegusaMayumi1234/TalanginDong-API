export const stringToMoney = (str: string) => {
  let retVal: string | number = str.replace(/[,.]/g, '').trim();
  retVal = retVal.match(/[0-9]+/g)?.[0] ?? '0';
  return parseInt(retVal);
};
