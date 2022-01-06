import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//===========================element-ui================================
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//===========================global Components=========================
import EasyForm from "@/components/EasyForm";
Vue.component("EasyForm", EasyForm);

//===========================lodash=====================================
import __ from "lodash";
Vue.prototype.$__ = __;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
