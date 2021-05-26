<template>
    <div class="home-container">
        <home-left-container class="left-container"></home-left-container>
        <div class="right-container">
            <div class="right-container-main">
                <homeHistory class="home-history"></homeHistory>
                <homeRecord class="home-record"></homeRecord>
                <HomeBattleList class="home-battle-list"></HomeBattleList>
            </div>
        </div>
    </div>
</template>

<script setup>
import homeLeftContainer from './home-left-container.vue';
import homeHistory from './home-history.vue';
import homeRecord from './home-record.vue';
import HomeBattleList from './home-battle-list.vue';
import { useStore } from 'vuex';
let store = useStore();
store.dispatch('user/get_listDic_values');
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
    background: $backgroundcolor;
    //background: url("../assets/page/right.png");
}
.right-container-main {
    position: relative;
    width: column-width(3185);
    height: column-width(1935);
    //border: 2px solid $bordercolor;
    overflow: hidden;
}
.home-battle-list {
    //1590-1935
    position: absolute;
    width: column-width(1590);
    height: column-width(1935);
    top: 0;
    right: 0;
    //border: 2px solid $bordercolor;
}
.home-history {
    width: column-width(1520);
    height: column-width(645);
    border: 2px solid #3b4d5d;
    border-radius: 5px;
    margin-bottom: column-width(70);
    display: flex;
    justify-content: center;
    padding-top: column-width(45);
    flex-wrap: wrap;
}
.home-record {
    width: column-width(1680);
    height: column-width(1220);
    border: 2px solid $bordercolor;
    border-radius: 5px;
}
</style>
