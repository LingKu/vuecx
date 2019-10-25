# 安装

### 直接下载 / CDN 引用

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) 提供了基于 NPM 的 CDN 链接。以上的链接会一直指向 NPM 上发布的最新版本。您也可以通过 `https://unpkg.com/vuex@2.0.0` 这样的方式指定特定的版本。
<!--/email_off-->

在 Vue 之后引入 `vuex` 会进行自动安装：

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex --save
```


在一个模块化的打包系统中，您必须显式地通过 `Vue.use()` 来安装 Vuex：

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
