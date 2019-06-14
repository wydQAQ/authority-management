<template>
  <div class="user">
    <div class="user-top">
      <div class="button-l">
        <Button @click="poModal = true" type="success">添加</Button>
        <Button type="warning" @click="openPutModal">编辑</Button>
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
          placeholder="请输入要查询的权限名"
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
      <Modal
        title="添加权限"
        ok-text="添加"
        cancel-text="取消"
        v-model="poModal"
        class-name="vertical-center-modal"
        @on-ok="postQuan"
        @on-cancel="clearModal"
      >
        <Form :mymodel="fromTop" label-position="left" :label-width="100">
          <FormItem label="权限设置">
            <Input v-model="fromTop.des"></Input>
          </FormItem>
          <FormItem label="权限状态码">
            <Select v-model="fromTop.status" placeholder="请选择状态码">
              <Option value="0">0</Option>
              <Option value="1">1</Option>
            </Select>
          </FormItem>
          <FormItem label="权限类型">
            <Select v-model="fromTop.type" placeholder="请选择类型">
              <Option value="menu">menu</Option>
              <Option value="router">router</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>

      <!-- 编辑弹出 -->
      <Modal
        title="编辑权限"
        ok-text="保存"
        cancel-text="取消"
        v-model="putModal"
        class-name="vertical-center-modal"
        @on-ok="putQuan"
        @on-cancel="clearPutModal"
      >
        <Form :mymodel="delRow" label-position="left" :label-width="100">
          <FormItem label="权限设置">
            <Input v-model="delRow.des"></Input>
          </FormItem>
          <FormItem label="权限状态码">
            <Select v-model="delRow.status" placeholder="请选择状态码">
              <Option value="0">0</Option>
              <Option value="1">1</Option>
            </Select>
          </FormItem>
          <FormItem label="权限类型">
            <Select v-model="delRow.type" placeholder="请选择类型">
              <Option value="menu">menu</Option>
              <Option value="router">router</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";
import { mapState } from "vuex";
import "iview/dist/styles/iview.css";

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
          title: "编号",
          key: "id"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "权限",
          key: "des"
        },
        {
          title: "状态码",
          key: "status"
        },
        {
          title: "提交时间",
          key: "subon"
        },
        {
          title: "提交用户",
          key: "subby"
        }
      ],
      fromTop: {},
      pageSize: 8, //每页显示多少条
      dataCount: 10, //总条数
      pageCurrent: 1, //当前页
      nowData: [],
      delRow: "",
      putRow: "",
      delArray: [],
      searchVal: "",
      modal2: false,
      modal_loading: false,
      userquan: [],
      poModal: false,
      putModal: false
    };
  },
  components: {},
  methods: {
    openPutModal() {
      if (this.delRow != "") {
        this.putModal = true;
      } else {
        this.$Notice.error({
          title: "请勾选要编辑的项"
        });
      }
    },
    putQuan() {
      //处理提交人转换
      for (let i = 0; i < this.userlist.length; i++) {
        if (this.userlist[i].name == this.delRow.subby) {
          this.delRow.subby = this.userlist[i].id;
        }
      }
      server
        .delQuanData({
          id: this.putRow.id,
          pId: this.putRow.pId,
          type: this.putRow.type,
          des: this.putRow.des,
          status: this.putRow.status,
          del: this.putRow.del,
          subon: this.putRow.subon,
          subby: this.putRow.subby,
          code: this.putRow.code,
          url: this.putRow.url
        })
        .then(() => {
          this.initData();
          this.$Message.success("编辑成功");
          this.delRow = "";
        })
        .catch(e => {
          this.$Notice.error({
            title: "编辑异常"
          });
        });
    },
    clearPutModal() {
      this.delRow = "";
    },

    clearModal() {
      this.fromTop = {};
    },

    postQuan() {
      //添加操作
      server
        .postQuanData({
          id: Date.now(),
          pId: 0,
          des: this.fromTop.des,
          type: this.fromTop.type,
          status: this.fromTop.status,
          del: 0,
          subon: "2019-05-08 17:07:16",
          subby: 1001,
          code: 1,
          url: ""
        })
        .then(() => {
          this.initData();
          this.$Message.success("添加成功");
          console.log(this.fromTop);
          this.fromTop = {};
        })
        .catch(e => {
          this.$Message.error("添加异常");
        });
      //   console.log(this.fromTop);
    },
    //查询操作
    getSearch() {
      server
        .searchQuanData({
          des: this.searchVal
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
        // 批量删除
        if (this.delArray.length > 0) {
          for (let i = 0; i < this.delArray.length; i++) {
            server
              .delQuanData({
                id: this.delArray[i].id,
                pId: this.delArray[i].pId,
                type: this.delArray[i].type,
                des: this.delArray[i].des,
                status: this.delArray[i].status,
                del: 1,
                subon: this.delArray[i].subon,
                subby: this.userlist[i].subby,
                code: this.delArray[i].code,
                url: this.delArray[i].url
              })
              .then(res => {
                this.delArray = [];
              })
              .catch(e => {
                this.$Notice.error({
                  title: "删除异常"
                });
              });
          }
          this.initData();
        } else {
          // 选中删除
          for (let i = 0; i < this.userlist.length; i++) {
            if (this.userlist[i].name == this.delRow.subby) {
              this.delRow.subby = this.userlist[i].id;
            }
          }
          server
            .delQuanData({
              id: this.delRow.id,
              pId: this.delRow.pId,
              type: this.delRow.type,
              des: this.delRow.des,
              status: this.delRow.status,
              del: 1,
              subon: this.delRow.subon,
              subby: this.delRow.subby,
              code: this.delRow.code,
              url: this.delRow.url
            })
            .then(res => {
              this.initData();
              this.delRow = "";
            })
            .catch(e => {
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
      this.putRow = row;

      for (let i = 0; i < selection.length; i++) {
        this.delArray.push(selection[i]);
      }
    },
    changepage(index) {
      //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      let _start = (index - 1) * this.pageSize;
      //需要显示结束数据的index
      let _end = index * this.pageSize;
      //截取需要显示的数据
      this.nowData = this.userquan.slice(_start, _end);

      //储存当前页
      this.pageCurrent = index;
    },
    //每页显示的数据条数
    nowPageSize(index) {
      //实时获取当前需要显示的条数
      this.pageSize = index;
    },

    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    //添加弹出
    openDra() {},
    //编辑弹出
    openChangeDra() {},
    initData() {
      this.userquan = [];
      server.getQuanData().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          //   this.userquan.push(res.data[i]);
          for (let k = 0; k < this.userlist.length; k++) {
            if (this.userlist[k].id == res.data[i].subby) {
              res.data[i].subby = this.userlist[k].name;
              this.userquan.push(res.data[i]);
            }
          }
        }
        //初始化分页
        this.dataCount = this.userquan.length;
        this.changepage(this.pageCurrent);
      });
    }
  },
  computed: {
    ...mapState(["userlist"])
  },
  created() {
    //初始化分页
    this.pageCurrent = 1;
    this.initData();
    // 子组件发送添加请求 父组件重新初始化
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
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
</style>
