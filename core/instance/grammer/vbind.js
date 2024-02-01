import { getValue, code } from '../../util/handleObj.js';

export function checkBind(vm, VNode) {
  if (VNode.nodeType !== 1) { // 不是标签，返回
    return;
  }
  const attrNames = VNode.elm.getAttributeNames();
  for (let i = 0; i < attrNames.length; i++) {
    if (attrNames[i].indexOf('v-bind') === 0 || attrNames[i].indexOf(':') === 0) {
      vbind(vm, VNode, attrNames[i], VNode.elm.getAttribute(attrNames[i]));
    }
  }
}

function vbind(vm, VNode, name, value) {
  let k = name.split(':')[1];
  if (/^{[\W\w]+}$/.test(value)) { // 绑定的值为对象
    let attrValue = value.substring(1, value.length - 1).trim();
    const result = analysisAttrValue(vm, VNode, name, attrValue);
    console.log(result)
    VNode.elm.setAttribute(k, result);
  } else {
    let v = getValue(vm._data, value);
    VNode.elm.setAttribute(k, v); // 绑定的值为一个变量
  }
}

function analysisAttrValue(vm, VNode, name, value) {
  const attrValueList = value.split(',');
  const codeData = code(vm._data, VNode.env);
  let result = '';
  for (let i = 0; i < attrValueList.length; i++) {
    let expression = attrValueList[i].split(':')[1]; // trim 不能用在这里，为变量时 expression 为undefined
    if (expression) {
      // 【变量 ：表达式】形式
      if(isTrue(codeData, expression)) {
        // 课堂代码这里加了逗号，应该不加逗号的吧？？？
        result += attrValueList[i].split(':')[0];
      }
    } else {
      // 单纯一个变量
      // 课堂代码这里加了逗号，应该不加逗号的吧？？？
      result += attrValueList[i];
    }
  }
  return result;
}

function isTrue(codeData, expression) {
  let bool = false;
  let str = codeData + `if (${expression}) {bool = true;}`;
  bool = eval(str);
  return bool;
}