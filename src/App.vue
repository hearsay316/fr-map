<template>
    <router-view />
</template>

<script setup>
import echarts from 'echarts';
import { onMounted, ref } from 'vue';

const root = ref(null);

// 基于准备好的dom，初始化echarts实例
onMounted(() => {
    //   console.log(echarts,'ssfsff')
    //   const myChart = echarts.init(root?.value);
    // // 绘制图表
    //   myChart.setOption({
    //     title: {
    //       text: 'ECharts 入门示例'
    //     },
    //     tooltip: {},
    //     xAxis: {
    //       data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    //     },
    //     yAxis: {},
    //     series: [{
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20]
    //     }]
    //   });
});

// import HelloWorld from './components/HelloWorld.vue';

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
    width: 100%;
    height: 100%;
}
</style>
