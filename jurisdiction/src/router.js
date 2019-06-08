import Vue from "vue";
import Router from "vue-router";
import second from "./views/second.vue";
import login from "./views/login";
import userlist from "./components/userlist";
import userguan from "./components/userguan";
import userquan from "./components/userquan";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: login
    },
    {
      path: "/second",
      name: "second",
      component: second,
      children: [
        {
          path: "/userlist",
          component: userlist
        },
        {
          path: "/userguan",
          component: userguan
        },
        {
          path: "/userquan",
          component: userquan
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
