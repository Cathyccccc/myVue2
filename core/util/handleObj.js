import {deepClone} from './deepClone.js';

export function getValue(obj, templateName) {
  if (!obj) return;
  let nameList = templateName.split('.');
  let temp = obj;
  for(let i = 0; i < nameList.length; i++) {
    if (temp[nameList[i]]) {
      // console.log('有值', temp[nameList[i]])
      // v-for 找值划分为两部分（分离）：！！！
      //（1）首先在 _data 中找到数组，根据数组长度构建出相应的虚拟节点
      //（2）其次在渲染虚拟节点时，在 env 中找出具体的数据值，渲染到页面
      temp = temp[nameList[i]]; // 深度优先遍历
    } else {
      return undefined;
    }
  }
  return temp;
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

// 属性合并的意义：传递数据
export function mergeAttr(attr1, attr2) {
  if (!attr2) {
    return attr1;
  }
  let obj1 = deepClone(attr1);
  let obj2 = deepClone(attr2);
  return Object.assign({}, obj1, obj2);
  // let result = {};
  // let attrNames1 = Object.getOwnPropertyNames(obj1);
  // for(let i = 0; i < attrNames1.length; i++) {
  //   result[attrNames1[i]] = obj1[attrNames1[i]];
  // }
  // let attrNames2 = Object.getOwnPropertyNames(obj2); 
  // for(let i = 0; i< attrNames2.length; i++) {
  //   result[attrNames2[i]] = obj2[attrNames2[i]];
  // }
  // console.log('merge', result, Object.assign({}, obj1, obj2));
}

