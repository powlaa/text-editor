import Vue from "vue";
import App from "./App.vue";
import { MdIcon } from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(MdIcon);

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
}).$mount("#app");
