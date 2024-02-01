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
  // 这里如果使用 for...in... 时，需要在proxy的defineProperty设置enumeralbe:true，否则枚举失败，得不到属性
  // for...of...只能可迭代对象使用，如Array和Map，Set，String，TypedArray，内置对象(Object)不是可迭代对象！！！
  for(let prop in obj) {
    newObj[prop] = deepClone(obj[prop]);
  }
  // 另一种写法
  // const names = Object.getOwnPropertyNames(obj);
  // for(let i = 0; i< names.length; i++) {
  //   newObj[names[i]] = deepClone(obj[names[i]]);
  // }
  return newObj;
}

function cloneArray(arr) {
  let newArr = [];
  for(let i = 0; i < arr.length; i++) {
    newArr[i] = deepClone(arr[i]);
  }
  return newArr;
}