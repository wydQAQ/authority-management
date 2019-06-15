import Vue from "vue";
import Router from "vue-router";
import second from "./views/second.vue";
import login from "./views/login";

import loginUser from "./views/loginUser";
import second2 from "./views/second2";
import userlist2 from "./components/userlist2";
import userguan2 from "./components/userguan2";

import userlist from "./components/userlist";
import userguan from "./components/userguan";
import userquan from "./components/userquan";
import store from "./store";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: login
    },

    // 路由权限设置
    // {
    //   path: "/",
    //   name: "loginUser",
    //   component: loginUser
    // },
    // {
    //   path: "/second2",
    //   name: "second2",
    //   component: second2,
    //   children: [
    //     {
    //       path: "/user/list",
    //       component: userlist2,
    //       children: [
    //         {
    //           path: "/home/demo",
    //           component: userlist2,
    //           meta: {
    //             perId: 1314520
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       path: "/stu/list",
    //       component: userguan2,
    //       children: [
    //         {
    //           path: "/home/demo",
    //           component: userlist2,
    //           meta: {
    //             perId: 1314520
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },

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

// 全局前置守卫进行校验
// router.beforeEach(function(to, from, next) {
//   if (!to.meta.perId) {
//     next();
//   }
//   store.state.routerPerList.forEach(item => {
//     if (item == to.meta.perId) {
//       next();
//     } else {
//       next(false);
//     }
//   });
// });
export default router;
