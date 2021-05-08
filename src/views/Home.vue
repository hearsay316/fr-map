<template>
<div class="home-container">
  <div class="left-container"></div>
  <div  class="right-container"></div>
</div>
</template>

<script>
export default {
  name: "home"
}
</script>

<style scoped>
.home-container{
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
}
.left-container{
  background: red;
}
</style>
