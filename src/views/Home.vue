<template>
    <div class="home-container">
        <home-left-container class="left-container"></home-left-container>
        <div class="right-container"></div>
    </div>
</template>

<script>
import homeLeftContainer from './home-left-container.vue';
export default {
    name: 'Home',
    components: {
        homeLeftContainer
    }
};
</script>

<style lang="scss" scoped>
.home-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: column-width(480) 1fr;
}
.left-container {
    background: url('../assets/page/home-left-bg.png');
}
.right-container {
    //background: url("../assets/page/right.png");
}
</style>
