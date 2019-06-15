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
            <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
          </FormItem>
        </Form>
      </div>
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
                console.log(res.data.token);
                res.headers.token = res.data.token;
                console.log(res.headers)
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
      }
    }
  }
}
</style>
