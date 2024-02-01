import {constructProxy} from './proxy.js';
import {mount} from './mount.js';

let uid = 0;

function MixinInit(MyVue2) {
  MyVue2.prototype._init = function(options) {
    console.log(options)
    const vm = this;
    vm.uid = uid++;
    vm._isVue = true;
    if (options && options.data) {
      vm._data = constructProxy(vm, options.data, '');
    }
    if (options && options.methods) {
      vm._methods = options.methods;
      for(let prop in options.methods) {
        vm[prop] = options.methods[prop];
      }
    }
    if (options && options.el) {
      let rootDom = document.getElementById(options.el);
      mount(vm, rootDom);
    }
  }
}

export default MixinInit;