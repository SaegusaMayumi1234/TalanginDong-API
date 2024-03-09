export const currencyStringToNumber = (str: string) => {
  let retVal = str.match(/(\d+[,.])*\d+/g)?.[0] ?? '0';
  if (/[,.]/g.test(retVal)) {
    if (retVal.at(-3) === ',') {
      retVal = retVal.replace(/\./g, '').replace(/,/g, '.');
    } else if (retVal.at(-3) === '.') {
      retVal = retVal.replace(/,/g, '');
    } else {
      retVal = retVal.replace(/[,.]/g, '');
    }
  }
  return parseInt(retVal);
};
