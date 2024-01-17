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

// test.x.a  -->  [test, x, a] 根据真实值设置到 _data
export function setValue(obj, attrValueStr, value) {
  if (!obj) return;
  let valueStrList = attrValueStr.split('.'); 
  let temp = obj;
  for(let i = 0; i < valueStrList.length - 1; i++) {
    if (temp[valueStrList[i]]) {
      temp = temp[valueStrList[i]];
    }
  }
  // if (temp[valueStrList[valueStrList.length - 1]] != null) { // 这里课程代码写的有歧义，比如响应式的初始值定义为null
  //   temp[valueStrList[valueStrList.length - 1]] = value;
  // }
  if (temp.hasOwnProperty(valueStrList[valueStrList.length - 1])) {
    temp[valueStrList[valueStrList.length - 1]] = value;
  }
}