import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import routes from "./router";
import VueRouter from "vue-router";
import "./public-path";
console.log("routes", routes);
let Router = null;
let instance = null;

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

//------------------------------------------------------------

/* eslint-disable */
//渲染函数
function render(props = {}) {
    const { container, routerBase } = props;
    //在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
    Router = new VueRouter({
        base: window.__POWERED_BY_QIANKUN__ ? routerBase : "/",
        mode: "history",
        routes: routes,
    });
    // 挂载应用
    instance = new Vue({
        router: Router,
        store,
        render: (h) => h(App),
    }).$mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

//------------------------------------------------------------
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
    console.log("VueMicroApp bootstraped");
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
    console.log("VueMicroApp mount", props);
    render(props);
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
    console.log("VueMicroApp unmount");
    instance.$destroy();
    instance.$el.innerHTML = "";
    instance = null;
    Router = null;
}
