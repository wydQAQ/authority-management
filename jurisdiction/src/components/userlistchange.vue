<template>
  <div class="userChange">
    <Drawer title="编辑用户" v-model="closePut" width="500" :mask-closable="false" :styles="styles">
      <Form :model="changeData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="用户名" label-position="top">
              <Input v-model="changeData.name" placeholder="请输入用户名"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="大学" label-position="top">
              <Input v-model="changeData.school" placeholder="请输入学校名称"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="选择身份" label-position="top">
              <Select v-model="changeData.isTeacher" placeholder="请选择身份">
                <Option value="private">教师</Option>
                <Option value="public">学生</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="邮箱" label-position="top">
              <Input v-model="changeData.mail" placeholder="请输入邮箱"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="电话" label-position="top">
              <Input v-model="changeData.phone" placeholder="请输入电话"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="clPut">取消</Button>
        <Button type="primary" @click="putU">保存</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import eventbus from "../eventbus";
import server from "../lib/server/index";
export default {
  name: "userChange",
  data() {
    return {
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      changeData: {},
      closePut: false
    };
  },
  methods: {
    clPut() {
      this.closePut = false;
      this.changeData = {
        // name: "",
        // school: "",
        // isTeacher: "",
        // mail: "",
        // phone: ""
      };
    },
    putU() {
      this.closePut = false;
      server
        .putUserData({
          id: this.changeData.id,
          name: this.changeData.name,
          school: this.changeData.school,
          isTeacher: this.changeData.isTeacher,
          mail: this.changeData.mail,
          phone: this.changeData.phone
        })
        .then(() => {
          this.$Notice.success({
            title: "编辑成功"
          });
          this.changeData = {};
          eventbus.$emit("putUser", true);
        })
        .catch(e => {
          this.$Notice.error({
            title: "编辑异常 请刷新后重试"
          });
        });
    }
  },
  created() {
    eventbus.$on("selectionData", item => {
      this.changeData = item;
      eventbus.$on("shitPut", item => {
        this.closePut = item;
      });
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
