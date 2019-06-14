<template>
  <div class="rolePrivilege">
    <!-- 分配权限对话框 -->
    <Modal
      @on-ok="savePriv"
      @on-cancel="cancelPriv"
      ok-text="保存"
      v-model="modal2"
      draggable
      scrollable
      title="角色分配权限"
    >
      <div
        class="curRole"
        style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-bottom:6px;"
      >
        当前选择的角色：
        <input readonly :value="roleName" />
      </div>
      <!-- 所有的权限对应的多选框 -->
      <div class="cbAll">
        <label v-for="item in perList" :key="item.permissionId">
          <input type="checkbox" v-model="item.isChecked" />
          {{ item.permissionDes }}
        </label>
      </div>
      <!-- </CheckboxGroup> -->
    </Modal>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";

export default {
  name: "rolePrivilege",
  data() {
    return {
      modal2: false,
      perList: [], // 重新渲染后的权限列表
      oriPerList: [], // 后台的原始权限列表
      roleName: "", // 选中行的角色 name
      roleId: "" // 选中行的角色 id
    };
  },
  methods: {
    // 取消按钮
    cancelPriv() {
      this.modal2 = false;
    },
    // 保存按钮
    savePriv() {
      this.perList.forEach(perItem => {
        if (perItem.isChecked === perItem.isOriChecked) {
          return;
        }
        if (perItem.isChecked) {
          server
            .postRolePer({
              id: Date.now() + Math.ceil(Math.random() * 100),
              roleId: this.roleId,
              permissionId: perItem.permissionId,
              del: 0,
              subOn: "2019-06-10 09:49:23"
            })
            .then(() => {
              this.$Message.success("权限分配成功！");
            })
            .catch(e => {
              this.$Message.error("权限分配异常！" + e);
            });
        } else {
          server
            .delRolePer({
              id: perItem.id,
              roleId: this.roleId,
              permissionId: perItem.permissionId,
              del: 1,
              subOn: "2019-06-10 09:49:23"
            })
            .then(() => {
              this.$Message.success("权限移除成功！");
            })
            .catch(e => {
              this.$Message.error("权限移除异常！" + e);
            });
        }
      });
    },
    // 初始化当前对话框 checkbox 权限列表
    initPerList() {
      // 初始化前清空 checkbox 列表数据
      this.perList = [];
      this.initOriPerList(() => {
        server.getRolePer({ roleId: this.roleId }).then(res => {
          this.oriPerList.forEach(perItem => {
            let isChecked = false;
            let id = 0;
            res.data.forEach(rolePerItem => {
              if (perItem.id === rolePerItem.permissionId) {
                isChecked = true;
                id = rolePerItem.id;
              }
            });
            this.perList.push({
              id: id,
              permissionId: perItem.id,
              permissionDes: perItem.des,
              isChecked: isChecked,
              isOriChecked: isChecked
            });
          });
        });
      });
    },
    // 初始化后台原始权限列表
    initOriPerList(cb) {
      this.oriPerList = [];
      server.getQuanData().then(res => {
        res.data.forEach(privItem => {
          this.oriPerList.push(privItem);
        });
      });
      cb();
    }
  },
  created() {
    // 当有选中行时打开当前子组件
    eventbus.$on("selectionData", item => {
      this.roleName = item.name;
      this.roleId = item.id;
    });
    eventbus.$on("openModal2", item => {
      if (this.roleName != "") {
        this.modal2 = item;
        this.initPerList();
      } else {
        this.$Message.warning("请选择角色！");
      }
    });
  }
};
</script>

<style scoped lang="scss">
.curRole {
  font-size: 16px;
  input {
    border: none;
    outline: none;
    color: rgb(219, 72, 14);
  }
}
.cbAll {
  padding-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  label {
    width: 30%;
    line-height: 30px;
    cursor: pointer;
    font-size: 12px;
    input {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      background-color: #fff;
    }
  }
}
</style>
