import { setValue } from '../../util/handleObj.js';

export function vmodel(vm, elm, attrValueStr) {
  elm.onchange = function(event) {
    // console.log('event:', event, elm.value); // 这里 elm.value 和 event.target.value 是一样的，因为 elm 就是 e.target，即 input 标签
    setValue(vm._data, attrValueStr, elm.value); // 数据对象，属性绑定的字符串，当前标签的真实值（页面）
  }
}