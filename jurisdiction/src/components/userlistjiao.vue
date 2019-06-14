<template>
  <div class="userjiao">
    <Modal
      ok-text="设置"
      @on-cancel="clearUser"
      @on-ok="postUser"
      cancel-text="取消"
      v-model="userModal"
      draggable
      scrollable
      title="用户身份设置"
    >
      <template>
        <div class="Username">
          <div class="userJ">
            当前选择用户 :
            <input readonly v-model="username" />
          </div>
          <div class="userBtn"></div>
        </div>
        <CheckboxGroup>
          <label
            class="checkbox-wrapper"
            v-for="item in userList"
            :key="item.roleId"
          >
            <input type="checkbox" v-model="item.isChecked" />
            {{ item.roleName }}
          </label>
        </CheckboxGroup>
      </template>
    </Modal>
  </div>
</template>

<script>
import server from "../lib/server/index";
import eventbus from "../eventbus";
export default {
  name: "userjiao",
  data() {
    return {
      userModal: false,
      jiaoData: [],
      username: "",
      userid: "",
      newPostArr: [],
      checkChanged: "",
      userList: [],
      checkedArr: []
    };
  },
  methods: {
    initUserList() {
      this.userList = [];
      this.initJiao(() => {
        server.getListUserShen({ userId: this.userid }).then(res => {
          this.newPostArr.forEach(item => {
            let isChecked = false;
            let id = 0;
            res.data.forEach(userRole => {
              if (userRole.roleId === item.id) {
                this.checkedArr = [];
                this.checkedArr.push(userRole.roleId);
                isChecked = true;
                id = userRole.id;
              }
            });
            this.userList.push({
              id: id,
              roleId: item.id,
              roleName: item.name,
              isChecked: isChecked, // 用户是否选中。
              isOriginChecked: isChecked // 原始的选中状态
            });
          });
        });
      });
    },
    initJiao(cb) {
      this.newPostArr = [];
      server.getRole().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.newPostArr.push(res.data[i]);
        }
        cb();
      });
    },
    clearUser() {
      this.chuanData = true;
      this.username = "";
    },
    postUser() {
      this.userList.forEach(item => {
        if (item.isChecked === item.isOriginChecked) {
          return;
        }
        if (item.isOriginChecked) {
          server
            .deleteListUserShen({
              id: item.id,
              userId: this.userid,
              roleId: item.roleId,
              del: 1,
              subon: "2019-05-08 16:57:50"
            })
            .then(() => {
              this.$Message.success("移除身份成功");
            });
        } else {
          if (
            item.isChecked == true &&
            this.checkedArr.indexOf(item.roleId) == -1
          ) {
            server
              .postListUserShen({
                id: Date.now() + Math.ceil(Math.random() * 100),
                userId: this.userid,
                roleId: item.roleId,
                del: 0,
                subon: "2019-05-08 16:57:50"
              })
              .then(() => {
                this.username = "";
                this.$Notice.success({
                  title: "设置身份成功"
                });
              })
              .catch(e => {
                this.$Notice.error({
                  title: "设置身份异常"
                });
              });
          }
        }
      });
    }
  },
  created() {
    eventbus.$on("selectionData", item => {
      this.username = item.name;
      this.userid = item.id;
    });
    eventbus.$on("openUserJiao", item => {
      if (this.username != "") {
        this.userModal = item;
        this.initUserList();
      } else {
        this.$Message.error("请选择要设置身份的用户");
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.Username {
  width: 100%;
  height: 75px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  input {
    border: none;
    outline: none;
    width: 32px;
  }
}
h3 {
  height: 40px;
}
.checkbox-wrapper {
  width: 100px;
  margin-left: 12px;
  margin-top: 20px;
}
</style>
