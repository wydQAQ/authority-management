<template>
  <div id="login">
    <div class="login-menu">
      <h1>权限登录</h1>
      <div class="login-from">
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <div class="from-item">
            <FormItem prop="username">
              <Input type="text" v-model="formInline.username" placeholder="用户名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </div>
          <div class="from-item">
            <FormItem prop="password">
              <Input
                type="password"
                @keyup.enter.native="handleSubmit('formInline')"
                v-model="formInline.password"
                placeholder="密码"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </div>
          <FormItem class="submit">
            <Button type="success" @click="handleSubmit('formInline')">登录</Button>
            <Button type="primary" @click="openRegisModal">注册</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div>
      <Modal class="resgis-bg" v-model="openRegis" footer-hide fullscreen title="注册用户">
        <div class="logmenu">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="94">
            <FormItem label="用户名" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="mail">
              <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
            </FormItem>
            <FormItem label="设置用户账号" prop="regisName">
              <Input v-model="formValidate.regisName" placeholder="请输入账号"></Input>
            </FormItem>
            <FormItem label="设置用户密码" prop="regisPassword">
              <Input v-model="formValidate.regisPassword" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="设置电话" prop="regisPhone">
              <Input v-model="formValidate.regisPhone" placeholder="请输入电话"></Input>
            </FormItem>
            <FormItem label="设置学校" prop="regisSchool">
              <Input v-model="formValidate.regisSchool" placeholder="请输入学校名称"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="regisSubmit('formValidate')">确认</Button>
              <Button @click="cancelRegis" style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import "iview/dist/styles/iview.css";
import server from "../lib/server/index";
export default {
  name: "login",
  data() {
    return {
      formInline: {
        username: "",
        password: ""
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码至少六位",
            trigger: "blur"
          }
        ]
      },
      openRegis: false,
      formValidate: {
        name: "",
        mail: "",
        regisName: "",
        regisPassword: "",
        regisPhone: "",
        regisSchool: "家里蹲大学"
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        regisName: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        regisPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        mail: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur"
          },
          { type: "email", message: "电子邮件格式不正确", trigger: "blur" }
        ],
        regisPhone: [
          {
            required: true,
            message: "电话不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(i) {
      this.$refs[i].validate(valid => {
        if (valid) {
          server
            .login({
              username: this.formInline.username,
              password: this.formInline.password
            })
            .then(res => {
              if (res.data.code == 1) {
                this.$store.commit("inituserIdList", res.data.user.id);
                this.$Spin.show();
                setTimeout(() => {
                  this.$Spin.hide();
                  this.$router.push("/second");
                }, 1000);
              } else {
                this.$Message.error("请检查用户名或密码 重新输入");
              }
            });
        } else {
          this.$Message.error("请检查用户名或密码 重新输入");
        }
      });
    },
    openRegisModal() {
      this.openRegis = true;
    },
    regisSubmit() {
      if (this.formValidate.regisName === "") {
        this.$Notice.error({
          title: "请输入正确的用户信息"
        });
        return;
      } else {
        server
          .postUser({
            id: Date.now(),
            name: this.formValidate.name,
            mail: this.formValidate.mail,
            username: this.formValidate.regisName,
            password: this.formValidate.regisPassword,
            school: this.formValidate.regisSchool,
            phone: this.formValidate.regisPhone
          })
          .then(res => {
            this.openRegis = false;
            this.$Notice.success({
              title: "提交成功"
            });
          });
      }
    },
    cancelRegis() {
      this.openRegis = false;
    }
  }
};
</script>

<style lang="scss">
#login {
  .login-menu {
    background-color: transparent;
    width: 500px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -200px;
    border-radius: 12px;
    text-align: center;
    padding-top: 25px;
    .login-from {
      margin-top: 60px;
      text-align: center;
      .from-item {
        margin-top: 20px;
      }
      .submit {
        margin-top: 10px;
        .ivu-form-item-content {
          width: 200px;
          display: flex;
          justify-content: space-around;
        }
      }
    }
  }
}
.logmenu {
  width: 600px;
  height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -300px;
}
.ivu-modal-header-inner {
  text-align: center;
}
.resgis-bg {
  .ivu-modal-body {
    background-image: url("../assets/regis.jpg") !important;
    background-size: cover;
  }
}
.ivu-input-default {
  opacity: 0.7;
}
</style>
