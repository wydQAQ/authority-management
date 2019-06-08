<template>
  <div class="user">
    <div class="user-top">
      <Button @click="openDra" type="success">添加</Button>
      <Button type="warning">编辑</Button>
      <Button @click="delUser" type="error">删除</Button>
      <div class="search">
        <Input v-model="searchVal" placeholder="请输入要查询的用户名" style="width: auto"/>
        <Button @click="getSearch" type="primary" icon="ios-search">查询</Button>
        <Button @click="closeSearch" type="warning">取消</Button>
      </div>
    </div>
    <div class="user-lie">
      <div>
        <Table
          @on-select-all="delAll"
          @on-select="getsome"
          border
          ref="selection"
          :columns="columns4"
          :data="nowData"
        ></Table>
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
    <div>
      <UserAdd @addCancle="changeOpenD" :openD="openD"></UserAdd>
    </div>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";
import { mapMutations, mapState } from "vuex";
import UserAdd from "../components/userguanAdd";
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
          title: "教师",
          key: "isTeacher"
        }
      ],
      // userlist: [],
      teach: "",
      pageSize: 8, //每页显示多少条
      dataCount: 10, //总条数
      pageCurrent: 1, //当前页
      nowData: [],
      openD: false,
      delRow: "",
      delArray: [],
      searchVal: ""
    };
  },
  components: {
    UserAdd
  },
  methods: {
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
    closeSearch() {
      this.searchVal = "";
      this.initData();
    },

    delUser() {
      if (this.delArray.length > 0) {
        for (let i = 0; i < this.delArray.length; i++) {
          server
            .deluserData({
              id: this.delArray[i]
            })
            .then(res => {
              this.initData();
              this.delArray = [];
            });
        }
      } else {
        server
          .deluserData({
            id: this.delRow.id
          })
          .then(res => {
            this.initData();
          });
      }
    },
    //拿到当前选中的数据
    getRow(selection, row) {
      this.delRow = row;
    },
    //拿到当前全部选中的数据
    delAll(selection) {
      for (let i = 0; i < selection.length; i++) {
        this.delArray.push(selection[i].id);
      }
    },

    //批量选中
    getsome(selection) {
      for (let i = 0; i < selection.length; i++) {
        this.delArray.push(selection[i].id);
      }
    },
    changeOpenD(value) {
      this.openD = value;
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
    ...mapMutations(["inituserMesg"]),
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    openDra() {
      if (this.openD == false) {
        this.openD = true;
      }
    },
    initData() {
      server.getUsers().then(res => {
        // this.inituserMesg(res.data);
        let userlist = res.data;
        for (let i = 0; i < userlist.length; i++) {
          if (userlist[i].isTeacher == true) {
            userlist[i].isTeacher = "教师";
          } else {
            userlist[i].isTeacher = "学生";
          }
        }
        //数据存入vuex
        this.inituserMesg(userlist);

        //初始化分页
        this.dataCount = userlist.length;
        this.changepage(this.pageCurrent);
      });
    }
  },
  computed: {
    ...mapState(["userlist"])
  },
  created() {
    this.pageCurrent = 1;
    this.initData();
    eventbus.$on("getUser", item => {
      if (item == true) {
        this.initData();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.user-lie {
  padding-top: 80px;
  width: 95%;
  margin: 0 auto;
  .ivu-page {
    position: absolute;
    right: 32px;
    bottom: 120px;
  }
  .page {
    position: absolute;
    left: 32px;
    bottom: 120px;
  }
}
.user-top {
  height: 50px;
  line-height: 50px;
  padding-top: 30px;
  padding-left: 30px;
  button {
    width: 80px;
    margin-left: 10px;
  }
}
.search {
  width: 326px;
  height: 40px;
  margin-left: 830px;
  margin-top: -48px;
  button {
    margin-left: 2px;
  }
}
</style>

