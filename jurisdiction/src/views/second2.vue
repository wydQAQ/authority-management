<template>
  <div class="second2">
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
            <p
              v-for="item in wydlist"
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
    </div>
  </div>
</template>

<script>
import server from "../lib/server/index";
import { mapState } from "vuex";

export default {
  name: "second2",
  data() {
    return {
      wydlist: []
    };
  },
  computed: {
    ...mapState(["userlist"])
  },
  created() {
    this.userlist.forEach(item => {
      server.getUserPerMenuUser({ id: item }).then(res => {
        res.data.forEach(item => {
          this.wydlist.push(item);
        });
        console.log(this.wydlist);
      });
      server.getUserPerRouter({ id: item }).then(res => {
        res.data.forEach(item => {
          this.$store.commit("initRouterPer", item.id);
        });
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.second2 {
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
