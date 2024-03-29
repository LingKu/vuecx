/*
 * @Author: qinuoyun
 * @Date:   2019-10-23 18:45:54
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2019-11-05 16:28:36
 */
import Vue from 'vue'

let uuid = 1;

let vuecx = [];

let _options = {};

let ROOT = [];

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise(val) {
  return val && typeof val.then === 'function'
}

function assert(condition, msg) {
  if (!condition) { throw new Error(("[vuecx] " + msg)) }
}

function genericSubscribe(fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function() {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function forEachValue(obj, fn) {
  Object.keys(obj).forEach(function(key) { return fn(obj[key], key); });
}

function unifyObjectStyle(type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  } else {
    assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function normalizeNamespace(fn) {
  return function(namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
  return Array.isArray(map) ?
    map.map(function(key) { return ({ key: key, val: key }); }) :
    Object.keys(map).map(function(key) { return ({ key: key, val: map[key] }); })
}

function getNum(arr, val) {
  let lang = arr.length;
  let halfLang = Math.floor(lang / 2);
  if (arr[halfLang] >= val) {
    arr.splice(halfLang, (lang - halfLang));
    return this.getNum(arr, val)
  } else {
    if (lang <= 2) {
      return arr[halfLang];
    }
    arr.splice(0, (halfLang));
    return this.getNum(arr, val)
  }
}

function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}

/**
 * 用户查找组件注册时
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
const common = function(argument) {
  let lists = Object.keys(ROOT);
  if (isInArray(lists, String(argument._uid))) {
    return argument;
  }
  let _parent = argument.$parent;
  if (_parent) {
    if (isInArray(lists, String(_parent._uid))) {
      return _parent;
    } else {
      return common(_parent);
    }
  }
}


/**
 * 注册方法
 * @param  {[type]} store   新store
 * @param  {[type]} type    函数名
 * @param  {[type]} handler 原始函数库
 * @param  {[type]} local   旧store
 * @return {[type]}         [description]
 */
function registerMutation(store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler(payload) {
    handler.call(store, local.state, payload);
  });
}


function registerAction(store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler(payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      state: local.state,
    }, payload, cb);

    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function(err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}



/**
 *  状态管理类
 */
class Store {
  /**
   * 构造函数
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  constructor(options) {
    this.install(options);
    uuid++;
  }
  install(options) {
    _options = options;
    vuecx[uuid] = {
      state: Vue.observable(options.state),
      mutations: options.mutations,
      actions: options.actions
    };
  }

}


/**
 * 状态地图
 * @param  {[type]} namespace [description]
 * @param  {Object} states)   {                 var res [description]
 * @param  {[type]} set:      function(value) {                           let $root [description]
 * @return {[type]}           [description]
 */
export const mapState = normalizeNamespace(function(namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function(ref) {
    var key = ref.key;
    var val = ref.val;
    res[key] = {
      get: function(value) {
        let $root = common(this);
        var state = $root.vuecx.state;
        return typeof val === 'function' ?
          val.call(this, state) :
          state[val]
      },
      set: function(value) {
        let $root = common(this);
        var state = $root.vuecx.state;
        return value;
      }
    };
    res[key].vuecx = true;
  });
  return res
});

/**
 * 注册提交时间-用于修改状态值
 * @param  {[type]} _type    [description]
 * @param  {[type]} _payload [description]
 * @param  {[type]} _options [description]
 * @return {[type]}          [description]
 */
function commit(_type, _payload, _options) {
  var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
  var type = ref.type;
  var payload = ref.payload;
  var options = ref.options;

  var mutation = { type: type, payload: payload };

  var entry = this._mutations[type];

  if (!entry) {
    {
      console.error(("[vuecx] unknown mutation type: " + type));
    }
    return
  }
  _withCommit(function() {
    entry.forEach(function commitIterator(handler) {
      handler(payload);
    });
  });
}

function subscribeAction(fn) {
  var subs = typeof fn === 'function' ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers)
}


function dispatch(_type, _payload) {
  var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
  var type = ref.type;
  var payload = ref.payload;

  var action = { type: type, payload: payload };
  console.log("this", this);

  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuecx] unknown action type: " + type));
    }
    return
  }

  try {
    this._actionSubscribers
      .filter(function(sub) { return sub.before; })
      .forEach(function(sub) { return sub.before(action, this$1.state); });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[vuecx] error in before action subscribers: ");
      console.error(e);
    }
  }

  var result = entry.length > 1 ?
    Promise.all(entry.map(function(handler) { return handler(payload); })) :
    entry[0](payload);

  return result.then(function(res) {
    try {
      this$1._actionSubscribers
        .filter(function(sub) { return sub.after; })
        .forEach(function(sub) { return sub.after(action, this$1.state); });
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("[vuecx] error in after action subscribers: ");
        console.error(e);
      }
    }
    return res
  })
}


/**
 * 只是为了执行事件
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
function _withCommit(fn) {
  fn();
}




/**
 * 执行Mutations
 * @param  {[type]} namespace  [description]
 * @param  {Object} mutations) {             var res [description]
 * @return {[type]}            [description]
 */
export const mapMutations = normalizeNamespace(function(namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function(ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation() {
      var args = [],
        len = arguments.length;
      while (len--) args[len] = arguments[len];

      let $root = common(this);

      return typeof val === 'function' ?
        val.apply(this, [commit].concat(args)) :
        commit.apply($root.vuecx, [val].concat(args)) //如果不是函数执行
    };
  });
  return res
});

/**
 * 执行mapActions
 * @param  {[type]} namespace [description]
 * @param  {Object} actions)  {             var res [description]
 * @return {[type]}           [description]
 */
export const mapActions = normalizeNamespace(function(namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function(ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction() {
      var args = [],
        len = arguments.length;
      while (len--) args[len] = arguments[len];

      let $root = common(this);


      return typeof val === 'function' ?
        val.apply(this, [dispatch].concat(args)) :
        dispatch.apply($root.vuecx, [val].concat(args))
    };
  });
  return res
});


/**
 * 初始化注册
 * @param  {[type]} vue [description]
 * @return {[type]}     [description]
 */
export const bootstrap = function(vue) {
  let newState = Object.assign({}, _options.state);
  let store = {
    state: Vue.observable(newState),
    dispatch: function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    },
    commit: function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options)
    },
    _mutations: [],
    _actions: [],
    _actionSubscribers: [],

  }
  for (let i in _options.mutations) {
    let item = _options.mutations[i];
    let name = item.name;
    //用于注册修改方法，实现 (state, height) state表示当前状态 height为传参
    registerMutation(store, name, _options.mutations[name], store);
  }

  for (let e in _options.actions) {
    let item = _options.actions[e];
    let name = item.name;
    //用于注册修改方法，实现 (state, height) state表示当前状态 height为传参
    registerAction(store, name, _options.actions[name], store);
  }



  vue.vuecx = store;
  ROOT[vue._uid] = vue;
}

export default {
  Store: Store,
  version: '1.0.8'
};
