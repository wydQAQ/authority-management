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
      width="570"
    >
      <template>
        <div class="Username">
          <div class="userJ">
            当前选择用户 :
            <input readonly v-model="userPowername">
          </div>
          <div class="powerSearch">
            <Input v-model="powerData" placeholder="输入关键字查询" clearable style="width: 200px"/>
            <Icon @click="searchPower" type="md-search"/>
            <Icon @click="cancelPower" type="ios-sync"/>
          </div>
        </div>
        <Scroll height="200" :on-reach-edge="handleReachEdge">
          <CheckboxGroup>
            <label class="checkbox-wrapper" v-for="item in userPower" :key="item.permissionId">
              <input type="checkbox" v-model="item.isChecked">
              {{item.permissionName}}
            </label>
          </CheckboxGroup>
        </Scroll>
      </template>
    </Modal>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";
export default {
  name: "onePower",
  data() {
    return {
      powerModal: false,
      userPowername: "",
      userPower: [],
      newPowerArr: [],
      userid: "",
      pageNum: 1,
      maxNumm: "",
      powerData: ""
    };
  },
  methods: {
    searchPower() {
    },
    cancelPower() {
      this.powerData = "";
    },
    handleReachEdge(dir) {
      return new Promise(resolve => {
        setTimeout(() => {
          // 往上滑
          if (dir > 0) {
            if (this.pageNum <= 1) {
              return this.$Message.warning("已经到第一页辣！憋滑我辣！");
            } else {
              this.pageNum--;
              this.inituserPower();
            }
            // 往下滑
          } else {
            if (this.pageNum == this.maxNumm) {
              this.$Message.warning("已经到最后一页辣！ (ﾟДﾟ*)ﾉ");
              this.pageNum -= 1;
            }
            this.pageNum++;
            this.inituserPower();
          }
          resolve();
        }, 1000);
      });
    },
    clearPowerUser() {
      this.userPowername = "";
    },
    postPowerUser() {},
    inituserPower() {
      this.userPower = [];
      this.initPower(() => {
        server.getPowerData({ userId: this.userid }).then(res => {
          this.newPowerArr.forEach(item => {
            let isChecked = false;
            let id = 0;
            res.data.forEach(userRole => {
              if (userRole.permissionId === item.id) {
                this.checkedArr = [];
                this.checkedArr.push(userRole.permissionId);
                isChecked = true;
                id = userRole.id;
              }
            });
            this.userPower.push({
              id: id,
              permissionId: item.id,
              permissionName: item.des,
              isChecked: isChecked, // 权限是否选中。
              isOriginChecked: isChecked // 原始的选中状态
            });
          });
        });
      });
    },
    initPower(cb) {
      this.newPowerArr = [];
      server.getPerPage({ pageNum: this.pageNum }).then(res => {
        let total = parseInt(res.headers["x-total-count"]);
        this.maxNumm = Math.ceil(total / 12);
        for (let i = 0; i < res.data.length; i++) {
          this.newPowerArr.push(res.data[i]);
        }
        cb();
      });
    }
  },
  created() {
    eventbus.$on("openUserPower", item => {
      if (this.userPowername != "") {
        this.powerModal = item;
        this.inituserPower();
      } else {
        this.$Message.error("请选择要设置权限的用户");
      }
    });
    eventbus.$on("selectionPowerData", item => {
      this.userPowername = item.name;
      this.userid = item.id;
    });
  }
};
</script>

<style lang="scss" scoped>
.Username {
  width: 100%;
  height: 40px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    border: none;
    outline: none;
    width: 32px;
    color: rgb(219, 72, 14);
  }
  i {
    margin-left: 10px;
    font-size: 26px;
    cursor: pointer;
  }
}
h3 {
  height: 40px;
}
.ivu-checkbox-group {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.checkbox-wrapper {
  width: 148px;
  line-height: 55px;
}
.ivu-scroll-wrapper {
  margin-top: 50px;
}
</style>
