<template>
  <div class="empty">
    <div>Empty模型下[_uid={{this._uid}}]{{demo}}</div>
    <demo_1 />
  </div>
</template>
<script type="text/javascript">
import demo_1 from './demo_1.vue'
import store from './store'
import vuecx from '@/index.js'
import {bootstrap} from '@/index.js'

new vuecx.Store(store);

console.log("a1");

export default {
  name: "Demo",
  components: {
    demo_1
  },
  provide: {
    for: "daskldjkla"
  },
  props: {
    num: [Array, Object, Number]
  },
  data() {
    return {
      demo: "daskldjkla"
    }
  },
  beforeCreate() {
    bootstrap(this);
    console.log("创建前：");
    console.log(this.$el);
    console.log(this.$data);
    console.log("b1");

  },
  created() {
    console.log("b1");

  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {

  },
  methods: {

  }
}

</script>
<style type="text/css" lang="scss">
</style>
