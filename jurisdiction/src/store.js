import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userlist: [],
    rolelist: [],
    routerPerList: []
  },
  mutations: {
    inituserMesg(state, payload) {
      state.userlist = [];
      state.userlist.push(payload);
    },
    initRoleData(state, payload) {
      state.rolelist = payload;
    },
    initRouterPer(state, payload) {
      state.routerPerList.push(payload);
    }
    // pushUser(state, payload) {
    //   state.userlist.push(payload);
    // }
  },
  actions: {},
  getters: {
    // getuser(state) {
    //   let hj = []
    //   state.usermeg.forEach(item => {
    //     hj.push({
    //       username : item.name
    //     });
    //   });
    //   return hj
    // }
  }
});
