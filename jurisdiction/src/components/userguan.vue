<template>
  <div class="userguan">
    <Layout>
      <Header>
        <Button @click="openDra" type="success">添加</Button>
        <Button type="warning" @click="openChangeDra">编辑</Button>
        <Button @click="del" type="error">删除</Button>
      </Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
