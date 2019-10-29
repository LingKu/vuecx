<template>
  <div class="empty">
    <div @click="ondemo">ondemo页面方法</div>
    <div> demo2模型下[_uid={{this._uid}}]:{{ceshi}}<div></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapMutations, bootstrap } from '@/index.js'
console.log("a3");


export default {
  data() {
    return {

    }
  },
  beforeMount() {

  },
  created() {
    //bootstrap();

    //let d = mapState(['ceshi']);
    // console.log("b3", d);
    // console.log("b32", d.ceshi());
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapState(['ceshi']),

    nihao() {
      console.log("ni");
      return 1;
    }
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
    ...mapMutations(['set_demo']),
    ondemo() {
      this.set_demo(new Date());
      console.log("d3");
    }
  },
  mounted() {
    this.ceshi = "真的吗";
  }
}

</script>
<style type="text/css" lang="scss">
</style>
