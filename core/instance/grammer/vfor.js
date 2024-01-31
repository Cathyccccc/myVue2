import { getValue } from '../../util/handleObj.js';
import VNode from '../../vdom/vnode.js';

export function initVfor(vm, elm, parent, attrValueStr) {
  elm.instructions = attrValueStr;
  let virtualNode = new VNode(elm.nodeName, elm, [], '', getVirtualNodeData(attrValueStr)[2], parent, 0, '');
  parent.elm.removeChild(elm);
  parent.elm.appendChild(document.createTextNode("")); // 创建一个空的文本节点
  const realNodes = analysisInstructions(vm, elm, attrValueStr, parent);
  console.log(virtualNode)
  return virtualNode;
}

function analysisInstructions(vm, elm, instructions, parent) {
  // 获取到 v-for 循环数据的名称
  const dataStr = getVirtualNodeData(instructions);
  // 根据名称在 _data 中找到相应的真实数据值（这个名称不一定是 _data的一级属性，但是通过 getValue 函数也可找到）
  const data = getValue(vm._data, dataStr[2]);
  // 根据真实数据值生成相应的节点
  if(!data) {
    throw new Error('error');
  }
  let realNodes = [];
  for(let i = 0; i < data.length; i++) {
    const dom = document.createElement(elm.nodeName);
    let env = analysisKV(dataStr[0], data[i], i);
    dom.setAttribute('env', JSON.stringify(env));
    dom.innerHTML = elm.innerHTML;
    parent.elm.appendChild(dom);
    realNodes.push(dom);
  }
  console.log(realNodes)
  return realNodes;
}

function getVirtualNodeData(instructions) {
  const valueStrList = instructions.trim().split(' ');
  if(valueStrList.length !== 3 && (valueStrList[1] !== 'in' || valueStrList[1] !== 'of')) {
    throw new Error('error');
  }
  return valueStrList;
}

function analysisKV(str, obj, index) {
  const reg = /\([a-zA-Z0-9,-_$]+\)/g; // 这里一定要加逗号，否则不会匹配（item,index）格式
  if(reg.test(str)) {
    str = str.trim();
    str = str.substring(1, str.length - 1); // substring不包含最后一位
  }
  let keys = str.split(',');
  if(keys.length === 0) {
    throw new Error('error');
  }
  let env = {};
  if (keys.length >= 1) {
    env[keys[0]] = obj;
  }
  if (keys.length >= 2) {
    env[keys[1]] = index;
  }
  return env;
}