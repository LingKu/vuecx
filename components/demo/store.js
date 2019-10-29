/*
 * @Author: qinuoyun
 * @Date:   2019-10-24 16:08:04
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2019-10-29 12:09:00
 */

const state = {
    demo: 111,
    nike: "nike",
    ceshi: "测试",
}

const mutations = {
    set_demo: (state, height) => {
        console.log("我的", [state, height])
        state.ceshi = height;
    },
    boot_demo: (state) => {

    },
}


export default {
    state,
    mutations
}