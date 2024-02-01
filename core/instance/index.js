import initMixin from './init.js';
import renderMixin from './render.js';

function MyVue2(options) {
  console.log('myVue2')
  this._init(options); // 初始化
  if (this._created) {
    this._created.call(this);
  }
  this._render(options); // 页面渲染
}
initMixin(MyVue2);
renderMixin(MyVue2);

export default MyVue2;