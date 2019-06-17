<template>
  <div class="home">
    <div class="home-top">
      <h2>权限管理 - - 列表</h2>
      <div class="user">
        <div class="user-img"></div>
        <p class="user-name"></p>
      </div>
    </div>
    <div class="home-left">
      <div class="logo">
        <img src="../assets/logo.jpg" alt />
        <span>管理系统</span>
      </div>
      <div class="accodr">
        <Collapse simple>
          <Panel name="1">
            用户
            <p class="acc-item" slot="content">
              <router-link to="/usermsg">用户消息</router-link>
            </p>
            <p
              v-for="item in userMenuPer"
              :key="item.id"
              class="acc-item"
              slot="content"
            >
              <router-link :to="item.url">{{ item.des }}</router-link>
            </p>
          </Panel>
        </Collapse>
      </div>
    </div>
    <div class="home-right">
      <router-view />
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapState } from "vuex";
import server from "../lib/server/index";
export default {
  name: "home",
  data() {
    return {
      spinShow: false,
      userMenuPer: []
    };
  },
  computed: {
    ...mapState(["userIdList"])
  },
  components: {},
  methods: {
    ...mapMutations(["inituserMesg"]),
    //左侧列表点击局部加载
    closeSpin() {
      this.spinShow = true;
      setTimeout(() => {
        this.spinShow = false;
      }, 1000);
    },
    isTypeMenu(item) {
      return item.type == "menu";
    },
    isTypeRouter(item) {
      return item.type == "router";
    }
  },
  created() {
    server.getUsers().then(res => {
      this.inituserMesg(res.data);
    });
    server.getUserPerMenuUser({ id: this.userIdList }).then(res => {
      let menuArr = res.data.filter(this.isTypeMenu);
      menuArr.forEach(item => {
        this.userMenuPer.push(item);
      });
      let routerArr = res.data.filter(this.isTypeRouter);
      routerArr.forEach(item => {
        console.log(item);
        this.$store.commit("initRouterPer", item.id);
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.home {
  .home-top {
    background-color: #fff;
    width: 80%;
    height: 60px;
    margin-left: 20%;
    border-bottom-left-radius: 10px;
    h2 {
      line-height: 60px;
      margin-left: 2em;
    }
  }
  .home-left {
    background-color: #fff;
    width: 18%;
    height: 95vh;
    margin-top: -60px;
    border-bottom-right-radius: 10px;
    .logo {
      display: flex;
      align-items: center;
      img {
        width: 153px;
        height: 107px;
      }
      span {
        font-size: 20px;
      }
    }
  }
  .acc-item {
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
  .home-right {
    background-color: #fff;
    margin-left: 20%;
    width: 80%;
    height: 80vh;
    margin-top: -82vh;
    border-radius: 10px 0 0 10px;
    position: relative;
  }
}
</style>
