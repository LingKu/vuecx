<template>
    <div id="app">
        <div>
            <h3>第一次调用</h3>
            <demo msg="Welcome to Your Vue.js App" />
        </div>
        <div>
            <h3>第二次调用</h3>
            <demo msg="Welcome to Your Vue.js App" />
        </div>
    </div>
</template>
<script>
import demo from '@/components/demo'

export default {
    name: 'app',
    components: {
        demo
    }
}
</script>
<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>