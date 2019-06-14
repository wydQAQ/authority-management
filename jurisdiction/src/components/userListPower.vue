<template>
  <div class="onePower">
    <Modal
      ok-text="设置"
      @on-cancel="clearPowerUser"
      @on-ok="postPowerUser"
      cancel-text="取消"
      v-model="powerModal"
      draggable
      scrollable
      title="用户权限设置"
    >
      <template>
        <div class="Username">
          <div class="userJ">
            当前选择用户 :
            <input v-model="userPowername">
          </div>
        </div>
        <CheckboxGroup>
          <label class="checkbox-wrapper" v-for="item in userPower" :key="item.roleId">
            <input type="checkbox" v-model="item.isChecked">
            {{item.roleName}}
          </label>
        </CheckboxGroup>
      </template>
    </Modal>
  </div>
</template>

<script>
import eventbus from "../eventbus";
export default {
  name: "onePower",
  data() {
    return {
      powerModal: false,
      userPowername: "",
      userPower: [],
      newPowerArr:[]
    };
  },
  methods: {
    clearPowerUser() {
      this.userPowername = "";
    },
    postPowerUser() {},
        inituserPower() {
      this.userPower = [];
      this.initJiao(() => {
        server.getListUserShen({ userId: this.userid }).then(res => {
          this.newPowerArr.forEach(item => {
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
            this.userPower.push({
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
      this.newPowerArr = [];
      server.getRole().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.newPowerArr.push(res.data[i]);
        }
        cb();
      });
    },
  },
  created() {
    eventbus.$on("openUserPower", item => {
      if (this.userPowername != "") {
        this.powerModal = item;
      } else {
        this.$Message.error("请选择要设置权限的用户");
      }
    });
    eventbus.$on("selectionPowerData", item => {
      this.userPowername = item.name;
      //   this.userid = item.id;
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
