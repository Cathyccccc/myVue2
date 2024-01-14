import { getValue } from '../util/handleObj.js';

let node2TempMap = new Map();
let temp2NodeMap = new Map();

function renderMixin(MyVue2) {
  MyVue2.prototype._render = function(options) {
    const vm = this;
    renderNode(vm, vm._vnode);
  }
}

export function renderData(vm, dataNamespace) {
  console.log(temp2NodeMap)
  let vnodes = temp2NodeMap.get(dataNamespace);
  console.log(vnodes)
  if (vnodes !== null) {
    for(let i = 0; i < vnodes.length; i++) {
      renderNode(vm, vnodes[i]);
    }
  }
}

export function renderNode(vm, VNode) {
  if (VNode.nodeType === 3) {
    const templates = getNode2Templates(VNode);
    if(templates) {
      let result = VNode.text;
      for(let i = 0; i < templates.length; i++) {
        const value = getTemplateValue([vm._data, VNode.env], templates[i]);
        if (value) {
          result = result.replace(`{{${templates[i]}}}`, value);
        }
      }
      VNode.elm.nodeValue = result;
    }
  } else if (VNode.nodeType === 1) {
    const childs = VNode.children;
    for(let i = 0; i < childs.length; i++) {
      renderNode(vm, childs[i]);
    }
  }
}

export function prepareRender(vm, VNode) {
  // console.log(vm, VNode);
  if (VNode === null) return;
  // 判断当前节点是文本节点还是其他类型的节点
  if (VNode.nodeType === 3) {
    // 当前节点为文本节点
    // 找出文本节点是否包含模板字符串（正则）
    analysisTemplate(VNode);
  }
  // 其他类型的节点
  if (VNode.nodeType === 1) {
    // 当前节点为元素节点（标签）
    // 判断当前节点下是否还有文本节点（递归）
    const childs = VNode.children;
    for(let i = 0; i < childs.length; i++) {
      prepareRender(vm, childs[i]);
    }
  }
}

function analysisTemplate(VNode) {
  const str = VNode.text;
  const reg = /\{\{[0-9a-zA-Z.\[\]]+\}\}/g;
  const pattern = str.match(reg);
  if (pattern) {
    for(let i = 0; i < pattern.length; i++) {
      const temp = getTemplateName(pattern[i]);
      // 建立映射关系（Map）
      setTemplate2NodeMap(VNode, temp);
      setNode2TemplateMap(VNode, temp);
    }
  }
}

// 去掉模板字符串中的 {{}}
function getTemplateName(template) {
  return template.substring(2, template.length - 2);
}

// 注意 setTemplate2NodeMap 和 setNode2TemplateMap 有点绕，别把数据搞错了。。
// 建立 template 和 VNode 的映射（template => [VNode1, VNode2, ...])
function setTemplate2NodeMap(VNode, templateName) {
  let temp = temp2NodeMap.get(templateName);
  if (temp) {
    temp.push(VNode);
  } else {
    temp2NodeMap.set(templateName, [VNode]);
  }
}

// 建立 VNode 和 template 的映射（VNode => [template1, template2, ...])
function setNode2TemplateMap(VNode, templateName) {
  let vn = node2TempMap.get(VNode);
  if (vn) {
    vn.push(templateName);
  } else {
    node2TempMap.set(VNode, [templateName]);
  }
}

function getTemplateValue(objs, templateName) {
  for(let i = 0; i < objs.length; i++) {
    const value = getValue(objs[i], templateName);
    return value;
  }
}

function getNode2Templates(VNode) {
  return node2TempMap.get(VNode);
}


export default renderMixin;