import VNode from '../vdom/vnode.js';

export function initMount(MyVue2) {
  MyVue2.prototype.$mount = function(el) {
    let vm = this; // 谁（实例）调用了$mount方法
    const rootDom = document.getElementById(el);
    mount(vm, rootDom);
  }
}

export function mount(vm, el) {
  // console.log('mount: ', vm, el);
  vm._vnode = constructVNode(vm, el, null); // 实例，当前节点，父节点
}

function constructVNode(vm, elm, parent) {
  let tag = elm.nodeName;
  let children = [];
  let text = getNodeText(elm);
  let data = null;
  let nodeType = elm.nodeType;
  let key = null;
  const vnode = new VNode(tag, elm, children, text, data, parent, nodeType, key);
  const childs = el.childNodes;
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