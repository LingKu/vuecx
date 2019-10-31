# 安装

### 直接下载 / CDN 引用

[https://github.com/LingKu/vuecx.git](https://github.com/LingKu/vuecx.git)


### NPM

``` bash
npm install vuex --save
```

VUECX 和VUEX的区别是啥 VUEX是全局的状态管理 而VUECX是专门用来管理组件的状态管理器 当然VUEX也可以管理组件状态 但是却别是什么 
区别在于 如果一个组件 复用的时候 那么状态数据无法分开了 

假设 组件A包含了组件b包含了组件c 即：A<-b<-c

在页面用 调用两次 组件A 分别A’ A‘’  在VUEX的情况下 里面的状态数据是一样 A‘ 数据修改 A’‘ 数据也会修改

如果使用VUECX 就可以把数据独立出来 复用组件 只会在A b c中数据状态被修改 而不会 影响到A’‘


``` js
const state = {
  demo: 111,
  nike: "nike",
  ceshi: "测试",
}

const mutations = {
  set_demo: (state, height) => {
    console.log("我的",[state, height])
    state.ceshi = height;
  },
  boot_demo: (state) => {

  },
}


export default {
  state,
  mutations
}
```
嵌套组件中的最外层的组件

``` js
import store from './store'
import vuecx from '@/components/vuecx'
import {bootstrap} from '@/components/vuecx'

new vuecx.Store(store);

export default {
  beforeCreate() {
    bootstrap(this);
  }
}
```
内层组件操作


``` js
import { mapState, mapMutations } from '@/components/vuecx'

export default {
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapState(['ceshi'])
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  /**
   * 页面方法
   * @type {Object}
   */
  methods: {
    ...mapMutations(['set_demo'])
  }
}
```
