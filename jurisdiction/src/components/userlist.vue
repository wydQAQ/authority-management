<template>
  <div class="user">
    <div class="user-top">
      <div class="button-l">
        <!-- <Button @click="openDra" type="success">添加</Button> -->
        <Button type="warning" @click="openChangeDra">编辑</Button>
        <Button v-if="hasAddRole" type="primary" @click="userIdentity"
          >用户身份</Button
        >
        <Button @click="userPower">用户权限</Button>
        <Button @click="del" type="error">删除</Button>
      </div>
      <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align:center">
          <p>是否继续删除？</p>
        </div>
        <div slot="footer">
          <i-button
            type="error"
            size="large"
            long
            :loading="modal_loading"
            @click="delUser"
            >删除</i-button
          >
        </div>
      </Modal>
      <div class="search">
        <Input
          v-model="searchVal"
          placeholder="请输入要查询的用户名"
          style="width: auto"
        />
        <Button @click="getSearch" type="primary" icon="ios-search"
          >查询</Button
        >
        <Button @click="closeSearch" type="warning">取消</Button>
      </div>
    </div>
    <div class="user-lie">
      <div>
        <Table
          @on-select-all="delAll"
          @on-select="getRow"
          border
          ref="selection"
          :columns="columns4"
          :data="nowData"
        ></Table>
        <div class="pageall">
          <Page
            :total="dataCount"
            :page-size="pageSize"
            @on-change="changepage"
            @on-page-size-change="nowPageSize"
          />
          <div class="page">
            <Button @click="handleSelectAll(true)">全选</Button>
            <Button @click="handleSelectAll(false)">取消全选</Button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <UserAdd></UserAdd>
      <UserChange></UserChange>
      <UserJiao></UserJiao>
      <UserPower></UserPower>
    </div>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";
import { mapState } from "vuex";
import UserAdd from "../components/userlistAdd";
import UserChange from "../components/userlistchange";
import "iview/dist/styles/iview.css";
import UserJiao from "../components/userlistjiao";
import UserPower from "../components/userListPower";
export default {
  name: "user",
  data() {
    return {
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "用户名",
          key: "name"
        },
        {
          title: "大学",
          key: "school"
        },
        {
          title: "电话",
          key: "phone"
        },
        {
          title: "邮箱",
          key: "mail"
        },
        {
          title: "用户身份",
          key: "userJiaoShen"
        }
      ],
      hasAddRole: false,
      userlist: [],
      pageSize: 8, //每页显示多少条
      dataCount: 10, //总条数
      pageCurrent: 1, //当前页
      nowData: [],
      delRow: "",
      delArray: [],
      searchVal: "",
      modal2: false,
      modal_loading: false
    };
  },
  components: {
    UserAdd,
    UserChange,
    UserJiao,
    UserPower
  },
  methods: {
    userIdentity() {
      eventbus.$emit("openUserJiao", true);
    },
    userPower() {
      eventbus.$emit("openUserPower", true);
    },
    //查询操作
    getSearch() {
      server
        .getsearchuser({
          name: this.searchVal
        })
        .then(res => {
          let newArr = [];
          for (let i = 0; i < res.data.length; i++) {
            newArr.push(res.data[i]);
          }
          this.nowData = newArr;
        });
    },
    //关闭查询
    closeSearch() {
      this.searchVal = "";
      this.initData();
    },
    del() {
      if (this.delRow == "" && this.delArray == "") {
        return;
      } else {
        this.modal2 = true;
      }
    },
    //删除用户
    delUser() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modal2 = false;
        //批量删除
        if (this.delArray.length > 0) {
          for (let i = 0; i < this.delArray.length; i++) {
            server
              .deluserData({
                id: this.delArray[i]
              })
              .then(() => {
                this.initData();
                this.delArray = [];
              })
              .catch(() => {
                this.$Notice.error({
                  title: "删除异常"
                });
              });
          }
        } else {
          //选中删除
          server
            .deluserData({
              id: this.delRow.id
            })
            .then(() => {
              this.initData();
            })
            .catch(() => {
              this.$Notice.error({
                title: "删除异常"
              });
            });
        }
        this.$Message.success("删除成功");
      }, 2000);
    },
    //拿到当前选中的数据
    getRow(selection, row) {
      this.delRow = row;
      eventbus.$emit("selectionData", row);
      eventbus.$emit("selectionPowerData", row);
    },
    //拿到当前全部选中的数据
    delAll(selection) {
      for (let i = 0; i < selection.length; i++) {
        this.delArray.push(selection[i].id);
      }
    },

    changepage(index) {
      //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      let _start = (index - 1) * this.pageSize;
      //需要显示结束数据的index
      let _end = index * this.pageSize;
      //截取需要显示的数据
      this.nowData = this.userlist.slice(_start, _end);
      //储存当前页
      this.pageCurrent = index;
    },
    //每页显示的数据条数
    nowPageSize(index) {
      //实时获取当前需要显示的条数
      this.pageSize = index;
    },
    //展开突变
    // ...mapMutations(["inituserMesg"]),
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    //添加弹出
    // openDra() {
    //   eventbus.$emit("shit", true);
    // },
    //编辑弹出
    openChangeDra() {
      eventbus.$emit("shitPut", true);
    },
    initData() {
      server.getUsers().then(res => {
        this.userlist = res.data;
        this.dataCount = this.userlist.length;
        this.changepage(this.pageCurrent);
      });
    }
  },
  computed: {
    ...mapState(["routerPerList"])
  },
  created() {
    //初始化分页
    this.pageCurrent = 1;
    this.initData();
    this.routerPerList.forEach(item => {
      if (item == "1560738275460") {
        console.log(this.hasAddRole);
        this.hasAddRole = true;
      }
    });
    eventbus.$on("getUser", item => {
      if (item == true) {
        this.initData();
      }
    });

    eventbus.$on("putUser", item => {
      if (item == true) {
        this.initData();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.user-lie {
  .pageall {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
  }
}
.user-top {
  height: 70px;
  line-height: 70px;
  border-top-left-radius: 10px;
  padding-left: 30px;
  display: flex;
  justify-content: space-between;
  background-color: #515a6e;
  button {
    width: 80px;
    margin-left: 10px;
  }
}
.search {
  width: 335px;
  height: 50px;
  button {
    margin-left: 2px;
  }
}
</style>
