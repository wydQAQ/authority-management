<template>
  <div class="userguanAdd">
    <Drawer title="添加用户" v-model="openD"  width="400" :mask-closable="false" :styles="styles">
      <Form :model="formData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="用户名" label-position="top">
              <Input v-model="formData.name" placeholder="请输入用户名"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="大学" label-position="top">
              <Input v-model="formData.school" placeholder="请输入学校名称"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="邮箱" label-position="top">
              <Input v-model="formData.mail" placeholder="请输入邮箱"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="电话" label-position="top">
              <Input v-model="formData.phone" placeholder="请输入电话"/>
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
  name: "userguanAdd",
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
        school: "",
        // isTeacher: "",
        mail: "",
        phone: ""
      },
      openD: false
    };
  },
  // props: ["openD"],
  computed: {
    ...mapState(["userlist"])
  },
  methods: {
    ...mapMutations(["pushUser"]),
    //添加用户操作
    postU() {
      this.openD = false;
      // let newisTeacher = "";
      // //处理isTeacher属性
      // if (this.formData.isTeacher === "private") {
      //   newisTeacher = this.formData.isTeacher = true;
      // } else {
      //   newisTeacher = this.formData.isTeacher = false;
      // }
      if (this.formData.name === "") {
        this.$Notice.error({
          title: "请输入正确的用户信息"
        });
        return;
      } else {
        server
          .postUser({
            id: this.userlist.length + 1,
            name: this.formData.name,
            school: this.formData.school,
            phone: this.formData.phone,
            mail: this.formData.mail
            // isTeacher: newisTeacher
          })
          .then(res => {
            eventbus.$emit("getUser", true);
            this.formData = [];
          });
      }
    },
    closeOpen() {
      this.openD = false;
    }
  },
  created() {
    eventbus.$on("shit", item => {
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
