import VNode from '../vdom/vnode.js';
import { prepareRender, getTemplate2Nodes, clearMap, renderData, renderNode } from './render.js';
import { vmodel } from './grammer/vmodel.js';
import { initVfor } from './grammer/vfor.js';
import { mergeAttr } from '../util/handleObj.js';

export function initMount(MyVue2) {
  MyVue2.prototype.$mount = function (el) {
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
  let vnode = analysisAttr(vm, elm, parent); // 属性对内容的影响（如v-model)
  if (!vnode) {
    let tag = elm.nodeName;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let key = null;
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType, key);
    // 通过env将数据传递到子级
    if (elm.nodeType === 1 && elm.getAttribute('env')) {
      vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute('env'))); // 新建虚拟节点的env和原虚拟节点的env（继承来的）
    } else {
      vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
    }
    // console.log(vnode.env)
  }
  // console.log(vnode.nodeType, vnode, elm)
  const childs = vnode.nodeType === 0 ? vnode.parent.elm.childNodes : elm.childNodes;
  for (let i = 0; i < childs.length; i++) {
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
  if (elm.nodeType === 1) {
    let attrNames = elm.getAttributeNames();
    for (let i = 0; i < attrNames.length; i++) {
      if (attrNames[i].indexOf('v-model') > -1) {
        vmodel(vm, elm, elm.getAttribute('v-model'));
      }
      if (attrNames[i].indexOf('v-for') > -1) {
        return initVfor(vm, elm, parent, elm.getAttribute('v-for'));
      }
    }
  }
}

export function rebuild(vm, namespace) {
  const vnodes = getTemplate2Nodes(namespace); // 这里拿到的是 v-for 虚拟节点数组（当多次使用 v-for 循环 namespace 数据时，该组长度不为 1）
  for(let i = 0; i < vnodes.length; i++) {
    vnodes[i].parent.elm.innerHTML = ''; // 移除原来的真实节点
    vnodes[i].parent.elm.appendChild(vnodes[i].elm); // 改为最初的li节点
    let newVirtualNodes = constructVNode(vm, vnodes[i].elm, vnodes[i].parent); // 将li改为和数据长度对应个数的li(及相应的子级)
    vnodes[i].parent.children = [newVirtualNodes]; // 修改父节点的children为新的虚拟节点（对应数据个数）
    console.log(newVirtualNodes)
  }
  clearMap(); // 节点修改了，清除之前的映射关系
    prepareRender(vm, vm._vnode); // 设置新的映射关系（这里为什么直接修改整个映射？？？？）    
    // 为什么 push 了一条数据后不渲染 ？？？
    // renderNode(vm, vm._vnode);
}

