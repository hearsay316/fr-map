<template>
    <div>
        <div class="home-history-title"></div>
        <div ref="root" class="home-history-echarts-line"></div>
    </div>
</template>

<script setup>
import { ElButton } from 'element-plus';
import echarts from 'echarts';
import { onMounted, ref } from 'vue';

const root = ref(null);

// 基于准备好的dom，初始化echarts实例
onMounted(() => {
    console.log(echarts, 'ssfsff');
    const myChart = echarts.init(root?.value);
    // 绘制图表
    myChart.setOption({
        tooltip: {},
        grid: {
            x: 30,
            y: 10,
            x2: 0,
            y2: 30,
            borderWidth: 10
        },
        xAxis: {
            data: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
            ],
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                    // width: 8 //这里是为了突出显示加上的
                }
            }
        },
        yAxis: {
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            }

            // axisTick: { show: true },
            // axisLine: { show: true }
        },
        series: [
            {
                name: '销量',
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(98, 162, 205,.1)'
                },
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
    });
});

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style lang="scss" scoped>
.home-history-title {
    width: column-width(1405);
    height: column-width(58);
    background: url('../assets/page/home-history-title.png');
    background-size: 100% 100%;
    margin-bottom: column-width(72);
}
.home-history-echarts-line {
    width: column-width(1338);
    height: column-width(408);
    //border: 1px solid red;
}
</style>
