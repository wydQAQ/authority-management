import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iview from "iview";
import "iview/dist/styles/iview.css";
import {
  Form,
  Spin,
  Collapse,
  Drawer,
  Notice,
  Modal,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Scroll
} from "iview";
Vue.use(Form);
Vue.use(Spin);
Vue.use(Collapse);
Vue.use(Drawer);
Vue.use(Notice);
Vue.use(Modal);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Scroll);

Vue.config.productionTip = false;
Vue.use(iview);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
