<template>
  <div class="userguan">
    <!-- 布局 -->
    <Layout>
      <!-- 头部按钮区域 -->
      <Header class="header">
        <div class="header-btn">
          <Button @click="openDra" type="success">添加</Button>
          <Button type="warning" @click="openChangeDra">编辑</Button>
          <Button @click="del" type="error">删除</Button>
          <Modal v-model="modal" width="360" @on-cancel="delCancel">
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
                @click="delRole"
                >删除</i-button
              >
            </div>
          </Modal>
        </div>
        <!-- 搜索区域 -->
        <div class="header-search">
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
      </Header>
      <!-- 主体表格区域 -->
      <Content>
        <!-- 表格 -->
        <Table
          @on-select-all="getAll"
          @on-select="getRow"
          border
          ref="selection"
          :columns="columns"
          :data="nowData"
        ></Table>
        <!-- 页码 -->
        <div class="page">
          <!-- 全选部分 -->
          <div class="page-btn">
            <Button @click="handleSelectAll(true)">全选</Button>
            <Button @click="handleSelectAll(false)">取消全选</Button>
          </div>
          <!-- 分页器部分 -->
          <Page
            class="page-pagination"
            :total="dataCount"
            :page-size="pageSize"
            @on-change="changepage"
            @on-page-size-change="nowPageSize"
          />
        </div>
      </Content>
    </Layout>
    <div>
      <RoleAdd></RoleAdd>
      <RoleChange></RoleChange>
    </div>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";
import RoleAdd from "../components/RoleGuanAdd";
import RoleChange from "../components/RoleGuanChange";
import { mapMutations, mapState } from "vuex";

export default {
  name: "userguan",
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "角色名",
          key: "name"
        },
        {
          title: "角色描述",
          key: "des"
        },
        {
          title: "提交时间",
          key: "subon"
        }
      ],
      dataCount: 10, // 数据总条数
      pageSize: 8, // 每页显示多少条
      pageCurrent: 1, // 当前页码
      nowData: [],
      modal: false,
      modal_loading: false,
      searchVal: "",
      delRow: "", // 选中单条数据
      delArray: [] // 全选
    };
  },
  methods: {
    // 点击查询
    getSearch() {
      server.getsearchrole({ name: this.searchVal }).then(res => {
        this.nowData = res.data;
      });
    },
    // 查询取消
    closeSearch() {
      this.searchVal = "";
      this.initData();
    },
    // 全选/取消全选方法
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    changepage(index) {
      //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      let _start = (index - 1) * this.pageSize;
      //需要显示结束数据的index
      let _end = index * this.pageSize;
      //截取需要显示的数据
      this.nowData = this.rolelist.slice(_start, _end);
      //储存当前页
      this.pageCurrent = index;
    },
    nowPageSize(index) {
      this.pageSize = index;
    },
    // 点击删除调出对话框
    del() {
      if (this.delRow == "" && this.delArray == "") {
        return;
      } else {
        this.modal = true;
      }
    },
    // 删除角色
    delRole() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modal = false;
        if (this.delArray.length > 0) {
          for (let k = 0; k < this.delArray.length; k++) {
            this.delArray[k].del = 1;
            server.putRoleDel(this.delArray[k]);
          }
        } else {
          this.delRow.del = 1;
          server.putRoleDel(this.delRow).then(() => {});
        }
        this.initData();
        this.$Message.success("删除成功!");
      }, 1000);
    },
    delCancel() {
      this.delRow = "";
      this.delArray = [];
    },
    // 拿到当前选中项角色
    getRow(selection, row) {
      this.delRow = row;
      eventbus.$emit("selectionData", row);
    },
    // 拿到全部角色
    getAll(selection) {
      for (let i = 0; i < selection.length; i++) {
        this.delArray.push(selection[i]);
      }
    },
    // 打开添加页面
    openDra() {
      eventbus.$emit("openAdd", true);
    },
    // 打开编辑页面
    openChangeDra() {
      eventbus.$emit("openPut", true);
    },
    // 展开突变
    ...mapMutations(["initRoleData"]),
    // 表格初始化
    initData() {
      server.getRole().then(res => {
        let rolelist = res.data;
        // 把初始化的数据存入 vuex 中
        this.initRoleData(rolelist);
        this.dataCount = this.rolelist.length;
        this.changepage(this.pageCurrent);
      });
    }
  },
  components: {
    RoleAdd,
    RoleChange
  },
  computed: mapState(["rolelist"]),
  created() {
    this.initData();
    eventbus.$on("getRole", item => {
      if (item == true) {
        this.initData();
      }
    });
    eventbus.$on("putRole", item => {
      if (item == true) {
        this.initData();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
// 头部布局使用 flex 布局
.ivu-layout {
  border-top-left-radius: 10px;
}
.header {
  display: flex;
  justify-content: space-between;
  border-top-left-radius: 10px;

  .header-btn {
    button {
      width: 80px;
      margin-left: 10px;
    }
  }
  .header-search {
    button {
      margin-left: 2px;
    }
  }
}
// 页码部分使用 flex 布局
.page {
  display: flex;
  justify-content: space-between;
  padding: 10px 50px;
}
</style>
