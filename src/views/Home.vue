<template>
    <div class="home-container">
        <home-left-container class="left-container"></home-left-container>
        <div class="right-container">
            <div class="right-container-main">
                <div class="home-history"></div>
                <div class="home-record"></div>
                <div class="battle-list"></div>
            </div>
        </div>
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
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0d151b;
    //background: url("../assets/page/right.png");
}
.right-container-main {
    position: relative;
    width: column-width(3185);
    height: column-width(1935);
    border: 2px solid red;
    overflow: hidden;
}
.battle-list {
    //1590-1935
    position: absolute;
    width: column-width(1590);
    height: column-width(1935);
    top: 0;
    right: 0;
    border: 2px solid red;
}
.home-history {
    width: column-width(1520);
    height: column-width(645);
    border: 1px solid red;
    margin-bottom: column-width(70);
}
.home-record {
    width: column-width(1680);
    height: column-width(1220);
    border: 1px solid red;
}
</style>
