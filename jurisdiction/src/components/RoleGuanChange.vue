<template>
  <div class="roleChange">
    <Drawer
      title="编辑用户"
      v-model="closePut"
      width="500"
      :mask-closable="false"
      :styles="styles"
    >
      <Form :model="changeData">
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="角色名" label-position="top">
              <Input v-model="changeData.name" placeholder="请输入角色名" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="角色描述" label-position="top">
              <Input v-model="changeData.des" placeholder="请对角色进行描述" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="提交时间" label-position="top"
              ><br />
              <DatePicker
                v-model="changeData.subon"
                type="datetime"
                placeholder="请选择提交日期及时间"
                style="width: 200px"
              ></DatePicker>
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
  name: "roleChange",
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
      this.changeData = {};
    },
    putU() {
      this.closePut = false;
      server
        .putRoleData({
          id: this.changeData.id,
          name: this.changeData.name,
          des: this.changeData.des,
          subon: "2019-05-08 16:54:26",
          del: this.changeData.del
        })
        .then(() => {
          this.$Notice.success({
            title: "编辑成功"
          });
          this.changeData = {};
          eventbus.$emit("putRole", true);
        })
        .catch(e => {
          this.$Notice.error({
            title: "编辑异常 请刷新后重试" + e
          });
        });
    }
  },
  created() {
    eventbus.$on("selectionData", item => {
      this.changeData = item;
      eventbus.$on("openPut", item => {
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
