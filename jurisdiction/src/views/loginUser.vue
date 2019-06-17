<template>
  <div class="loginUser">
    <Button @click="toUser" type="primary">1004</Button>
    <Button @click="toStu" type="info">1005</Button>
    <Button @click="toAll" type="success">1006</Button>
  </div>
</template>

<script>
export default {
  name: "loginUser",
  data() {
    return {};
  },
  methods: {
    toUser() {
      this.$store.commit("inituserMesg", 1004);
      this.$router.push("/second2");
    },
    toStu() {
      this.$store.commit("inituserMesg", 1005);
      this.$router.push("/second2");
    },
    toAll() {
      this.$store.commit("inituserMesg", 1006);
      this.$router.push("/second2");
    }
  }
};
</script>

<style scoped lang="scss">
.loginUser {
  height: 600px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  button {
    width: 80px;
    height: 50px;
    margin-top: 30px;
  }
}
</style>
