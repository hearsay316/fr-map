<template>
    <div>
        <header class="home-record-header">
            <el-form ref="form" :inline="true" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-col :span="11">
                                <el-date-picker
                                    v-model="form_data.date1"
                                    type="date"
                                    placeholder="开始时间"
                                    style="width: 100%"
                                    class="fr-input"
                                    clearable
                                    prefix-icon="el-icon-date el-icon-color"
                                ></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-date-picker
                                    v-model="form_data.date2"
                                    type="date"
                                    placeholder="结束时间"
                                    style="width: 100%"
                                    prefix-icon="el-icon"
                                    class="fr-input"
                                    clearable
                                ></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input
                                v-model="form_data.name"
                                placeholder="请输入内容"
                                class="fr-input set-h-42"
                                clearable
                            >
                                <template #append>
                                    <div class="input-with-select-append">
                                        <div>
                                            <el-select
                                                v-model="select"
                                                clearable
                                                placeholder="状态"
                                            >
                                                <el-option label="餐厅名" value="1"></el-option>
                                                <el-option label="订单号" value="2"></el-option>
                                                <el-option label="用户电话" value="3"></el-option>
                                            </el-select>
                                        </div>
                                        <div>
                                            <el-button icon="el-icon-search"></el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </header>
        <el-table
            class="fr-table"
            :data="tableData"
            style="width: 100%"
            :row-class-name="tableRowClassName"
        >
            <el-table-column prop="date" label="日期" width="180"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
let form_data = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
});
let input3 = ref('');
let select = ref('');
let form = ref(null);
const tableData = reactive([
    {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    },
    {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    },
    {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    },
    {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    }
]);
function tableRowClassName({ row, rowIndex }) {
    console.log(6666);
    if (rowIndex % 2 === 1) {
        return 'warning-row';
    }
    return '';
}
</script>

<style lang="scss" scoped>
.home-record-header {
    width: column-width(1590);
    margin: column-width(40) auto column-width(32) auto;
}
</style>
