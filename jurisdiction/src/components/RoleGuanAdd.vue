<template>
  <div class="roleguanAdd">
    <Drawer
      title="添加角色"
      v-model="openD"
      width="500"
      :mask-closable="false"
      :styles="styles"
    >
      <Form :model="formData">
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="角色名" label-position="top">
              <Input v-model="formData.name" placeholder="请输入角色名" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="角色描述" label-position="top">
              <Input v-model="formData.des" placeholder="请对角色进行描述" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="提交时间" label-position="top"
              ><br />
              <DatePicker
                v-model="formData.subon"
                type="datetime"
                placeholder="请选择提交日期及时间"
                style="width: 200px"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="closeOpen">取消</Button>
        <Button type="primary" @click="postU">添加</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import eventbus from "../eventbus";
//引入封装的请求
import server from "../lib/server/index";
import { mapState, mapMutations } from "vuex";
export default {
  name: "roleguanAdd",
  data() {
    return {
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      formData: {
        name: "",
        des: "",
        subon: ""
      },
      openD: false
    };
  },
  methods: {
    ...mapMutations(["initRoleData"]),
    //添加角色操作
    postU() {
      this.openD = false;
      if (this.formData.name === "") {
        this.$Notice.error({
          title: "请输入正确的用户信息"
        });
        return;
      } else {
        server
          .postRole({
            id: this.rolelist.length + 1,
            name: this.formData.name,
            des: this.formData.des,
            subon: "2019-05-08 16:54:26",
            del: 0
          })
          .then(() => {
            eventbus.$emit("getRole", true);
            this.formData = [];
          });
      }
    },
    closeOpen() {
      this.openD = false;
    }
  },
  computed: mapState(["rolelist"]),
  created() {
    eventbus.$on("openAdd", item => {
      this.openD = item;
    });
  }
};
</script>

<style lang="scss" scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
