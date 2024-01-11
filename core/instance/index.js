import MixinInit from './init.js';

function MyVue2(options) {
  console.log('myVue2')
  this._init(options); // 初始化
  
}
MixinInit(MyVue2);
export default MyVue2;