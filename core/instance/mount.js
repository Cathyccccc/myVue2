import VNode from '../vdom/vnode.js';
import { prepareRender } from './render.js';
import { vmodel } from './grammer/vmodel.js';

export function initMount(MyVue2) {
  MyVue2.prototype.$mount = function(el) {
    let vm = this; // 谁（实例）调用了$mount方法
    const rootDom = document.getElementById(el);
    mount(vm, rootDom);
  }
}

export function mount(vm, el) {
  // console.log('mount: ', vm, el);
  // 构建虚拟 DOM 树
  vm._vnode = constructVNode(vm, el, null); // 实例，当前节点，父节点
  // 预备渲染（建立映射关系）
  prepareRender(vm, vm._vnode);
}

function constructVNode(vm, elm, parent) {
  analysisAttr(vm, elm, parent); // 属性对内容的影响（如v-model)
  let vnode = null;
  let tag = elm.nodeName;
  let children = [];
  let text = getNodeText(elm);
  let data = null;
  let nodeType = elm.nodeType;
  let key = null;
  vnode = new VNode(tag, elm, children, text, data, parent, nodeType, key);
  const childs = elm.childNodes;
  for(let i = 0; i < childs.length; i++) {
    let childNode = constructVNode(vm, childs[i], vnode);
    if (childNode instanceof VNode) {
      vnode.children.push(childNode);
    } else {
      vnode.children.concat(childNode); // 处理 v-for 循环插入节点
    }
  }
  return vnode;
}

function getNodeText(el) {
  if (el.nodeType === 3) {
    return el.nodeValue;
  } else {
    return '';
  }
}

function analysisAttr(vm, elm, parent) {
  if(elm.nodeType === 1) {
    let attrNames = elm.getAttributeNames();
    for(let i = 0; i< attrNames.length; i++) {
      if (attrNames[i].indexOf('v-model') > -1) {
        vmodel(vm, elm, elm.getAttribute('v-model'));
      }
    }
  }
}