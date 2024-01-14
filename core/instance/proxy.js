import {renderData} from './render.js';
function constructObjectProxy(vm, obj, namespace) {
  let proxyObj = {};
  for (let prop in obj) {
    Object.defineProperty(proxyObj, prop, {
      configurable: true,
      get: function() {
        return obj[prop];
      },
      set: function(value) {
        obj[prop] = value;
        console.log(getNameSpace(namespace, prop))
        renderData(vm, getNameSpace(namespace, prop));
      }
    });
    Object.defineProperty(vm, prop, {
      configurable: true,
      get: () => {
        return obj[prop];
      },
      set: (value) => {
        obj[prop] = value;
        console.log(getNameSpace(namespace, prop))
        renderData(vm, getNameSpace(namespace, prop));
      }
    })
    if (obj[prop] instanceof Object) {
      proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop))
    }
  }
  return proxyObj;
}

const arrayProto = Array.prototype;
function defArrayFunc(arr, funcName, namespace, vm) {
  Object.defineProperty({
    enumerable: true,
    writable: true,
    value: function(...args) {
      console.log('this: ', this);
      const result = arrayProto[funcName].apply(this, args); // 这里this应该指调用方法的数组
      renderData(vm, getNameSpace(namespace, ""));
      return result;
    }
  });
}

function proxyArr(vm, arr, namespace) {
  let prototype = {
    eleType: 'Array',
    toString: () => {
      let str = '';
      for(let i = 0; i < arr.length; i++) {
        str += arr[i] + ',';
      }
      return str.substring(0, str.length - 2); // 去掉最末尾的逗号
    },
    push: () => {},
    pop: () => {},
    shift: () => {},
    unshift: () => {},
  };
  defArrayFunc.call(vm, obj, 'push', namespace, vm);
  defArrayFunc.call(vm, obj, 'pop', namespace, vm);
  defArrayFunc.call(vm, obj, 'shift', namespace, vm);
  defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
  arr.__proto__ = prototype;
  return arr;
}

export function constructProxy(vm, obj, namespace) {
  let proxyObj = null;
  if(obj instanceof Array) {
    proxyObj = new Array(obj.length); // 创建长度为obj.length的数组，数组每一项为undefined
    // 代理数组项（数组的某一项发生变化时）
    for(let i = 0; i < obj.length; i++) {
      proxyObj[i] = constructProxy(vm, obj[i], namespace);
    }
    // 代理数组本身（调用数组的一些方法）
    proxyObj = proxyArr();
  } else if (obj instanceof Object) {
    proxyObj = constructObjectProxy(vm, obj, namespace);
  } else {
    throw new Error('error');
  }
  return proxyObj;
}

function getNameSpace(namespace, nowProp) {
  if (namespace === null || namespace === '') {
    return nowProp;
  } else if (nowProp === null || nowProp === '') {
    return namespace;
  } else {
    return namespace + '.' + nowProp;
  }
}