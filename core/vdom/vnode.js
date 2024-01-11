export default class VNode {
  constructor(
    tag,
    elm,
    children,
    text,
    data,
    parent,
    nodeType,
    key, // 这个是干嘛的？？？
  ) {
    this.tag = tag;
    this.elm = elm;
    this.children = children;
    this.text = text;
    this.data = data;
    this.parent = parent;
    this.nodeType = nodeType;
    this.key = key;
    this.env = {};
    this.instructions = null;
    this.template = [];
  }
}