import { getValue } from '../../util/handleObj.js';

export function checkVon(vm, VNode) {
  if (VNode.nodeType !== 1) {
    return;
  }
  const attrNames = VNode.elm.getAttributeNames();
  for(let i = 0; i < attrNames.length; i++) {
    if (attrNames[i].indexOf('v-on') === 0 || attrNames[i].indexOf('@') === 0) {
      const eventName = attrNames[i].split(':')[1] || attrNames[i].split('@')[1];
      von(vm, VNode, eventName, VNode.elm.getAttribute(attrNames[i]));
    }
  }
}

function von(vm, VNode, eventName, bindName) {
  const method = getValue(vm._methods, bindName);
  if(method) {
    VNode.elm.addEventListener(eventName, function() {
      bindFunc(vm, method);
    });
  } else {
    throw new Error(`${bindName} 方法不存在`);
  }
}

function bindFunc(vm, method) {
  method.call(vm);
}