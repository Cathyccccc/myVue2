export function getValue(obj, templateName) {
  if (!obj) return;
  let nameList = templateName.split('.');
  let temp = obj;
  for(let i = 0; i < nameList.length; i++) {
    if (temp[nameList[i]]) {
      return temp[nameList[i]];
    } else {
      return undefined;
    }
  }
  return null;
}