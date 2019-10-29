const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);
        // 添加别名
        config.resolve.alias
            .set('@', resolve('./'))
            .set('assets', resolve('./assets'))
            .set('components', resolve('./components'));
        config.externals = {
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios'
        }
    }
}