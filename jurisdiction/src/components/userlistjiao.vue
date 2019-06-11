<template>
  <div class="userjiao">
    <Modal ok-text="设置" cancel-text="取消" v-model="userModal" draggable scrollable title="用户身份设置">
      <RadioGroup v-model="jiaoData">
        <Radio v-for="(item) in userJiaoData" :label="item"></Radio>
        <!-- <Radio label="爪哇犀牛"></Radio>
        <Radio label="印度黑羚"></Radio>-->
      </RadioGroup>
    </Modal>
  </div>
</template>

<script>
import server from "../lib/server/index";
import eventbus from "../eventbus";
export default {
  name: "userjiao",
  data() {
    return {
      userModal: false,
      userJiaoData: [],
      jiaoData: ""
    };
  },
  created() {
    eventbus.$on("openUserJiao", item => {
      this.userModal = item;
    });

    server.getUserJiao().then(res => {
      console.log(res.data);
      for (let i = 0; i < res.data.length; i++) {
        this.userJiaoData.push(res.data[i].name);
      }
    });
  }
};
</script>

<style>
</style>
