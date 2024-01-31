export function deepClone(obj) {
  if (obj instanceof Object !== true) {
    return obj;
  }
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    return cloneObject(obj);
  }
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return cloneArray(obj);
  }
}

function cloneObject(obj) {
  let newObj = {};
  for(let prop in obj) {
    newObj[prop] = deepClone(obj[prop]);
  }
  return newObj;
}

function cloneArray(arr) {
  let newArr = [];
  for(let i = 0; i < arr.length; i++) {
    newArr[i] = deepClone(arr[i]);
  }
  return newArr;
}