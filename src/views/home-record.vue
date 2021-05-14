<template>
    <div>
        <el-date-picker
            v-model="value2"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="defaultTime2"
        >
        </el-date-picker>
    </div>
</template>

<script>
// import { reactive, ref } from 'vue';
// let value2 = ref(null);
// let defaultTime2 = reactive([new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)]);
//
export default {
    data() {
        return {
            value1: '',
            value2: '',
            defaultTime1: [new Date(2000, 1, 1, 12, 0, 0)], // '12:00:00'
            defaultTime2: [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)] // '12:00:00', '08:00:00'
        };
    }
};
</script>

<style scoped></style>
