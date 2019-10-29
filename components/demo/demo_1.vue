<template>
  <div class="empty">
    <div>demo1模型下[_uid={{this._uid}}]:{{ceshi}}</div>
    <demo_2 />
  </div>
</template>
<script type="text/javascript">
import demo_2 from './demo_2.vue'
import { mapState, mapMutations } from '@/index.js'
console.log("a2");

export default {
  components: {
    demo_2
  },
  props: {
    value: [Array, Object]
  },
  data() {
    return {

    }
  },
  created() {
    console.log("b2");
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapState(['ceshi'])
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {

  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {

  },
  /**
   * 页面方法
   * @type {Object}
   */
  methods: {

  }
}

</script>
<style type="text/css" lang="scss">
</style>
